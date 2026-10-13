import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AppContext = createContext(null)

// ─────────────────────────────────────────────────────────────────────────────
// Seed data
// ─────────────────────────────────────────────────────────────────────────────
const SEED_USERS = [
  {
    id: 'u1',
    fullName: 'Abebe Kebede',
    nationalId: '123456789',
    phoneNumber: '0911000001',
    email: 'abebe@example.com',
    address: 'Addis Ababa, Bole',
    password: 'citizen123',
    role: 'citizen',
    createdAt: '2024-01-10',
  },
  {
    id: 'u2',
    fullName: 'Tigist Haile',
    nationalId: '987654321',
    phoneNumber: '0911000002',
    email: 'tigist@example.com',
    address: 'Addis Ababa, Kirkos',
    password: 'citizen456',
    role: 'citizen',
    createdAt: '2024-02-15',
  },
  // ── Super admin — hardcoded, cannot be deleted ──
  {
    id: 'off1',
    fullName: 'Biruk Birhanu',       // ← change to your name
    nationalId: '111222333',          // ← change to your national ID
    phoneNumber: '0911100001',        // ← change to your phone
    email: 'biruk.officer@gov.et',    // ← change to your email
    address: 'Addis Ababa, Lideta',   // ← change to your address
    password: 'birukb0322',           // ← change to your password
    role: 'officer',
    isSuperAdmin: true,               // keep this — prevents deletion
    createdAt: '2023-06-01',
  },
 
]

const SEED_LAND_REQUESTS = [
  {
    id: 'LR-001', citizenId: 'u1', citizenName: 'Abebe Kebede',
    landType: 'Residential', size: '500 sqm', location: 'Bole Sub-city, Addis Ababa',
    purpose: 'Build family home', applicationDate: '2024-03-01',
    status: 'Approved', landId: 'LAND-AA-001', officerNote: 'All documents verified.', updatedAt: '2024-03-15',
  },
  {
    id: 'LR-002', citizenId: 'u1', citizenName: 'Abebe Kebede',
    landType: 'Commercial', size: '1200 sqm', location: 'Kirkos Sub-city, Addis Ababa',
    purpose: 'Small business', applicationDate: '2024-04-10',
    status: 'Pending', landId: null, officerNote: '', updatedAt: '2024-04-10',
  },
  {
    id: 'LR-003', citizenId: 'u2', citizenName: 'Tigist Haile',
    landType: 'Agricultural', size: '2000 sqm', location: 'Oromia Region, Sebeta',
    purpose: 'Farming', applicationDate: '2024-05-05',
    status: 'Under Review', landId: null, officerNote: '', updatedAt: '2024-05-05',
  },
  {
    id: 'LR-004', citizenId: 'u2', citizenName: 'Tigist Haile',
    landType: 'Residential', size: '300 sqm', location: 'Yeka Sub-city, Addis Ababa',
    purpose: 'Build apartment', applicationDate: '2024-06-20',
    status: 'Rejected', landId: null, officerNote: 'Incomplete documentation.', updatedAt: '2024-06-25',
  },
]

const SEED_INFRA_REPORTS = [
  {
    id: 'IR-001', citizenId: 'u1', citizenName: 'Abebe Kebede',
    issueType: 'Road Damage', location: 'Bole Road, near Edna Mall',
    description: 'Large pothole causing traffic hazard.', reportDate: '2024-04-01',
    status: 'Resolved', officerNote: 'Repaired on 2024-04-10.', updatedAt: '2024-04-10',
    comments: [],
  },
  {
    id: 'IR-002', citizenId: 'u1', citizenName: 'Abebe Kebede',
    issueType: 'Water Supply', location: 'Bole Sub-city, Block 5',
    description: 'No water supply for 3 days.', reportDate: '2024-05-15',
    status: 'In Progress', officerNote: 'Maintenance team dispatched.', updatedAt: '2024-05-16',
    comments: [],
  },
  {
    id: 'IR-003', citizenId: 'u2', citizenName: 'Tigist Haile',
    issueType: 'Street Light', location: 'Kirkos, Mexico Square',
    description: 'Street lights not working for a week.', reportDate: '2024-06-01',
    status: 'Pending', officerNote: '', updatedAt: '2024-06-01',
    comments: [],
  },
  {
    id: 'IR-004', citizenId: 'u2', citizenName: 'Tigist Haile',
    issueType: 'Sewage', location: 'Yeka, Kotebe area',
    description: 'Sewage overflow on main street.', reportDate: '2024-07-10',
    status: 'Pending', officerNote: '', updatedAt: '2024-07-10',
    comments: [],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [darkMode, setDarkMode]       = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers]             = useState(SEED_USERS)
  const [landRequests, setLandRequests]   = useState(SEED_LAND_REQUESTS)
  const [infraReports, setInfraReports]   = useState(SEED_INFRA_REPORTS)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  // ── Notifications helper functions ───────────────────────────────────────
  const isNotificationVisible = (notification, user) => {
    if (!user) return false
    if (notification.recipientUserIds?.includes(user.id)) return true
    if (notification.recipientRoles?.includes('officer') && user.role === 'officer') return true
    if (notification.recipientRoles?.includes('citizen') && user.role === 'citizen') return true
    if (notification.recipientRoles?.includes('superAdmin') && user.isSuperAdmin) return true
    return false
  }

  const updateUnreadCount = (notifs) => {
    if (!currentUser) {
      setUnreadCount(0)
      return
    }
    const visible = notifs.filter(n => isNotificationVisible(n, currentUser))
    const unread = visible.filter(n => !n.read).length
    setUnreadCount(unread)
  }

  // Dark mode persistence
  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved) setDarkMode(JSON.parse(saved))
  }, [])
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Fetch notifications from API when user is logged in
  useEffect(() => {
    if (currentUser) {
      // Initialize with local notifications for now
      const localNotifications = JSON.parse(localStorage.getItem('notifications') || '[]')
      setNotifications(localNotifications)
      
      // Calculate unread count
      const visible = localNotifications.filter(n => isNotificationVisible(n, currentUser))
      const unread = visible.filter(n => !n.read).length
      setUnreadCount(unread)
    } else {
      setNotifications([])
      setUnreadCount(0)
    }
  }, [currentUser])

  // Remove the problematic useEffect that was causing infinite loop
  // Notifications are now saved directly in the add/mark functions

  // User session persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem('currentUser')
      }
    }
  }, [])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('currentUser')
    }
  }, [currentUser])

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      // Try backend API authentication first
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set current user
      setCurrentUser(user);
      
      // Add user to users list if not already there (for backend users)
      setUsers(prevUsers => {
        const exists = prevUsers.find(u => u.email === user.email);
        if (!exists) {
          return [...prevUsers, { ...user, id: user._id }];
        }
        return prevUsers;
      });
      
      return { success: true, user };
    } catch (error) {
      console.error('Backend login failed, trying local authentication:', error);
      
      // Fallback to local authentication (for development/testing)
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        setCurrentUser(user);
        // Store a fake token for compatibility with OfficerMessagesPage
        localStorage.setItem('token', 'local-auth-token-' + user.id);
        return { success: true, user };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Invalid email or password.' 
      };
    }
  }

  // Public register → always creates a CITIZEN, never an officer
  const register = async (data) => {
    try {
      // Call backend API for registration
      const response = await api.post('/auth/register', {
        fullName: data.fullName,
        nationalId: data.nationalId,
        phoneNumber: data.phoneNumber,
        email: data.email,
        address: data.address,
        password: data.password
      });
      
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set current user
      setCurrentUser(user);
      
      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
    localStorage.removeItem('token')
  }

  // ── Officer management (officer-only) ─────────────────────────────────────
  const addOfficer = (data) => {
    const exists = users.find(
      u => u.email === data.email || u.nationalId === data.nationalId
    )
    if (exists) return { success: false, error: 'Email or National ID already exists.' }

    const newOfficer = {
      ...data,
      id: `off${Date.now()}`,
      role: 'officer',
      isSuperAdmin: false,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setUsers(prev => [...prev, newOfficer])
    addNotification(`New officer ${data.fullName} added`)
    return { success: true, user: newOfficer }
  }

  const removeOfficer = (id) => {
    const target = users.find(u => u.id === id)
    if (!target) return { success: false, error: 'User not found.' }
    if (target.isSuperAdmin) return { success: false, error: 'Cannot remove the super admin.' }
    setUsers(prev => prev.filter(u => u.id !== id))
    addNotification(`Officer ${target.fullName} removed`)
    return { success: true }
  }

  // ── Land requests ─────────────────────────────────────────────────────────
  const submitLandRequest = (data) => {
    const req = {
      ...data,
      id: `LR-${String(landRequests.length + 1).padStart(3, '0')}`,
      citizenId: currentUser.id,
      citizenName: currentUser.fullName,
      status: 'Pending',
      landId: null,
      officerNote: '',
      updatedAt: new Date().toISOString().split('T')[0],
    }
    setLandRequests(prev => [req, ...prev])
    addNotification({
      type: 'Land Request',
      title: `New land request ${req.id}`,
      message: `${currentUser.fullName} submitted a land request.`,
      details: `${req.landType} · ${req.location}`,
      recipientRoles: ['officer'],
      relatedType: 'land',
      relatedId: req.id,
    })
    return req
  }

  const updateLandRequest = (id, updates) => {
    setLandRequests(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
          : r
      )
    )

    const request = landRequests.find(r => r.id === id)
    if (!request) return

    const title = updates.status === 'Approved'
      ? 'Land request approved'
      : updates.status === 'Rejected'
        ? 'Land request rejected'
        : 'Land request updated'

    const message = updates.status === 'Approved'
      ? `Your land request ${id} was approved.`
      : updates.status === 'Rejected'
        ? `Your land request ${id} was rejected.`
        : `Your land request ${id} status changed to ${updates.status}.`

    const details = updates.status === 'Approved'
      ? `Land ID: ${updates.landId || request.landId || 'TBD'}`
      : updates.officerNote
        ? `Reason: ${updates.officerNote}`
        : ''

    addNotification({
      type: 'Approval / Rejection',
      title,
      message,
      details,
      recipientUserIds: [request.citizenId],
      relatedType: 'land',
      relatedId: id,
    })
  }

  // ── Infrastructure reports ────────────────────────────────────────────────
  const submitInfraReport = (data) => {
    const rep = {
      ...data,
      id: `IR-${String(infraReports.length + 1).padStart(3, '0')}`,
      citizenId: currentUser.id,
      citizenName: currentUser.fullName,
      status: 'Pending',
      officerNote: '',
      comments: [],
      updatedAt: new Date().toISOString().split('T')[0],
    }
    setInfraReports(prev => [rep, ...prev])
    addNotification({
      type: 'Infrastructure Report',
      title: 'New infrastructure report',
      message: `${currentUser.fullName} submitted report ${rep.id}.`,
      details: `${rep.issueType} · ${rep.location}`,
      recipientRoles: ['officer'],
      relatedType: 'infra',
      relatedId: rep.id,
    })
    return rep
  }

  const updateInfraReport = (id, updates) => {
    setInfraReports(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
          : r
      )
    )

    const report = infraReports.find(r => r.id === id)
    const title = updates.status === 'Resolved'
      ? 'Report resolved'
      : 'Report status updated'
    const message = updates.status === 'Resolved'
      ? `Your infrastructure report ${id} has been resolved.`
      : `Infrastructure report ${id} status changed to ${updates.status}.`
    const details = updates.officerNote ? `Officer note: ${updates.officerNote}` : ''

    addNotification({
      type: updates.status === 'Resolved' ? 'Resolution Updates' : 'Infrastructure Report',
      title,
      message,
      details,
      recipientUserIds: report ? [report.citizenId] : [],
      relatedType: 'infra',
      relatedId: id,
    })
  }

  const addInfraComment = (reportId, message) => {
    const comment = {
      id: `c${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      role: currentUser.role,
      isSuperAdmin: currentUser.isSuperAdmin || false,
      message,
      createdAt: new Date().toISOString(),
    }
    setInfraReports(prev => prev.map(r =>
      r.id === reportId
        ? { ...r, comments: [...(r.comments || []), comment], updatedAt: new Date().toISOString().split('T')[0] }
        : r
    ))

    const report = infraReports.find(r => r.id === reportId)
    if (!report) return comment

    const recipients = currentUser.role === 'citizen'
      ? ['officer']
      : ['citizen']

    const recipientUserIds = currentUser.role === 'citizen'
      ? []
      : [report.citizenId]

    const title = currentUser.role === 'citizen'
      ? `New user comment on ${reportId}`
      : `Officer commented on ${reportId}`

    const notificationMessage = currentUser.role === 'citizen'
      ? `${currentUser.fullName} left a comment on report ${reportId}.`
      : `Your report ${reportId} received a new officer comment.`

    addNotification({
      type: 'Comments',
      title,
      message: notificationMessage,
      details: comment.message,
      recipientRoles: recipients,
      recipientUserIds,
      relatedType: 'infra',
      relatedId: reportId,
    })
    return comment
  }

  // ── Notifications ─────────────────────────────────────────────────────────
  const visibleNotifications = currentUser
    ? notifications.filter(n => isNotificationVisible(n, currentUser))
    : []

  const addNotification = ({ type, title, message, details = '', recipientRoles = [], recipientUserIds = [], relatedType = '', relatedId = '' }) => {
    const newNotification = {
      id: `n${Date.now()}`,
      type,
      title,
      message,
      details,
      recipientRoles,
      recipientUserIds,
      relatedType,
      relatedId,
      timestamp: new Date().toISOString(),
      read: false,
    }
    
    setNotifications(prev => {
      const updated = [newNotification, ...prev]
      localStorage.setItem('notifications', JSON.stringify(updated))
      return updated
    })
    
    // Update unread count
    if (currentUser && isNotificationVisible(newNotification, currentUser)) {
      setUnreadCount(prev => prev + 1)
    }
  }

  const markNotificationRead = (id) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n)
      localStorage.setItem('notifications', JSON.stringify(updated))
      return updated
    })
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n =>
        isNotificationVisible(n, currentUser) ? { ...n, read: true } : n
      )
      localStorage.setItem('notifications', JSON.stringify(updated))
      return updated
    })
    setUnreadCount(0)
  }

  return (
    <AppContext.Provider value={{
      darkMode, setDarkMode,
      currentUser, setCurrentUser, login, register, logout,
      users, setUsers,
      addOfficer, removeOfficer,
      landRequests, submitLandRequest, updateLandRequest,
      infraReports, submitInfraReport, updateInfraReport, addInfraComment,
      notifications, visibleNotifications, addNotification,
      markAllRead, markNotificationRead,
      unreadCount,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
