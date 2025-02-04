import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from "./ui/alert";
import { Clock, LogIn, LogOut, User } from 'lucide-react';

// Environment variables with fallback for development
const API_URL = typeof window !== 'undefined' ? 
  window.env?.GOOGLE_SHEETS_API_URL || process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_URL : 
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_URL;
const IS_DEV = !API_URL || API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL';

// Session management
const SESSION_KEY = 'timeTrackingSession';

const saveSession = (userData) => {
  if (userData) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
};

const loadSession = () => {
  if (typeof window === 'undefined') return null;
  const savedSession = localStorage.getItem(SESSION_KEY);
  return savedSession ? JSON.parse(savedSession) : null;
};

// API functions
const api = {
  async login(username, password) {
    if (IS_DEV) {
      // Mock login for development
      const mockUsers = {
        'john.doe': { id: '1', password: 'password123', isAdmin: false, name: 'John Doe' },
        'admin': { id: '2', password: 'admin123', isAdmin: true, name: 'Admin User' }
      };
      
      const user = mockUsers[username];
      if (user && user.password === password) {
        return { success: true, user: { ...user, username } };
      }
      throw new Error('Invalid credentials');
    }

    try {
      const response = await fetch(`${API_URL}?action=login`, {
        method: 'POST',
        body: JSON.stringify({ action: 'login', username, password }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Login failed');
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.message.includes('NetworkError') || !navigator.onLine) {
        throw new Error('Cannot connect to the server. Please check your internet connection.');
      }
      if (error.message.includes('429')) {
        throw new Error('Too many login attempts. Please wait a few minutes and try again.');
      }
      if (error.message.includes('403')) {
        throw new Error('Access forbidden. Please contact your administrator.');
      }
      throw new Error(error.message === 'Failed to fetch' ? 
        'Cannot reach the server. Please try again later.' : 
        'Login failed: ' + error.message);
    }
  },

  async clockIn(userId) {
    if (IS_DEV) {
      return {
        success: true,
        timestamp: new Date().toISOString()
      };
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'clockIn',
          userId
        })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Clock in failed');
      }
      
      return data;
    } catch (error) {
      console.error('Clock in error:', error);
      throw new Error('Clock in failed: ' + error.message);
    }
  },

  async clockOut(userId) {
    if (IS_DEV) {
      return {
        success: true,
        timestamp: new Date().toISOString()
      };
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'clockOut',
          userId
        })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Clock out failed');
      }
      
      return data;
    } catch (error) {
      console.error('Clock out error:', error);
      throw new Error('Clock out failed: ' + error.message);
    }
  },

  async getTimeEntries(userId) {
    if (IS_DEV) {
      return {
        success: true,
        entries: [
          {
            id: '1',
            userId: userId,
            clockIn: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            clockOut: new Date().toISOString()
          }
        ]
      };
    }

    try {
      const response = await fetch(`${API_URL}?action=getTimeEntries&userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch time entries');
      }
      
      return data;
    } catch (error) {
      console.error('Fetch time entries error:', error);
      throw new Error('Failed to fetch time entries: ' + error.message);
    }
  }
};

const TimeTrackingApp = () => {
  const [user, setUser] = useState(() => loadSession());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [timeEntries, setTimeEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Check session validity on load
  useEffect(() => {
    const checkSession = async () => {
      const savedUser = loadSession();
      if (savedUser) {
        try {
          // Verify session is still valid by fetching time entries
          await api.getTimeEntries(savedUser.id);
          setUser(savedUser);
        } catch (error) {
          console.warn('Session invalid:', error);
          saveSession(null);
          setUser(null);
        }
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTimeEntries();
    }
  }, [user]);

  const showStatus = (message, isError = false) => {
    if (isError) {
      setError(message);
      setStatusMessage('');
    } else {
      setStatusMessage(message);
      setError('');
    }
    setTimeout(() => {
      if (isError) {
        setError('');
      } else {
        setStatusMessage('');
      }
    }, 5000);
  };

  const fetchTimeEntries = async () => {
    try {
      const data = await api.getTimeEntries(user.id);
      setTimeEntries(data.entries);
      const lastEntry = data.entries[data.entries.length - 1];
      if (lastEntry && !lastEntry.clockOut) {
        setCurrentEntry(lastEntry);
      }
    } catch (error) {
      showStatus(error.message, true);
    }
  };

  const login = async () => {
    setLoading(true);
    try {
      const data = await api.login(username, password);
      setUser(data.user);
      saveSession(data.user);
      showStatus('Login successful');
    } catch (error) {
      showStatus(error.message, true);
    } finally {
      setLoading(false);
      setPassword('');
    }
  };

  const logout = () => {
    setUser(null);
    setUsername('');
    setCurrentEntry(null);
    setTimeEntries([]);
    saveSession(null);
    showStatus('Logged out successfully');
  };

  const clockIn = async () => {
    setLoading(true);
    try {
      const data = await api.clockIn(user.id);
      await fetchTimeEntries();
      showStatus('Clocked in successfully');
    } catch (error) {
      showStatus(error.message, true);
    } finally {
      setLoading(false);
    }
  };

  const clockOut = async () => {
    setLoading(true);
    try {
      const data = await api.clockOut(user.id);
      await fetchTimeEntries();
      setCurrentEntry(null);
      showStatus('Clocked out successfully');
    } catch (error) {
      showStatus(error.message, true);
    } finally {
      setLoading(false);
    }
  };

  const calculateHours = (entries) => {
    const msToHours = ms => Math.round(ms / (1000 * 60 * 60) * 4) / 4;
    
    return entries.reduce((acc, entry) => {
      if (!entry.clockOut) return acc;
      
      const start = new Date(entry.clockIn);
      const end = new Date(entry.clockOut);
      const hours = msToHours(end - start);
      
      const isSunday = start.getDay() === 0;
      
      return {
        sundayHours: acc.sundayHours + (isSunday ? hours : 0),
        standardHours: acc.standardHours + (isSunday ? 0 : hours)
      };
    }, { sundayHours: 0, standardHours: 0 });
  };

  const hours = calculateHours(timeEntries);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      login();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <Card className="max-w-md mx-auto bg-slate-800 text-slate-100 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-6 w-6" />
            Courant Translator Time Tracking App
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-900 border-red-700">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {statusMessage && (
            <Alert className="mb-4 bg-green-900 border-green-700">
              <AlertDescription>{statusMessage}</AlertDescription>
            </Alert>
          )}

          {!user ? (
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-400"
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-400"
                  onKeyPress={handleKeyPress}
                />
              </div>
              <Button 
                onClick={login} 
                className="w-full"
                disabled={loading}
              >
                <LogIn className="h-4 w-4 mr-2" />
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>{user.name}</span>
                </div>
                <Button 
                  variant="outline" 
                  onClick={logout}
                  className="border-slate-600 text-slate-200 hover:bg-slate-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
              
              <div className="space-y-4">
                {!currentEntry ? (
                  <Button 
                    onClick={clockIn} 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Clock In'}
                  </Button>
                ) : (
                  <Button 
                    onClick={clockOut} 
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Clock Out'}
                  </Button>
                )}
                
                <div className="space-y-2 p-4 bg-slate-700 rounded-lg">
                  <p>Sunday Hours: {hours.sundayHours.toFixed(2)}</p>
                  <p>Standard Hours: {hours.standardHours.toFixed(2)}</p>
                </div>

                {user.isAdmin && (
                  <div className="pt-4 border-t border-slate-600">
                    <p className="text-sm text-slate-400 mb-2">
                      Admin: Access the full report in Google Sheets
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {IS_DEV && (
            <div className="mt-4 p-2 bg-yellow-900 rounded text-xs">
              Development mode: Using mock data
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeTrackingApp;