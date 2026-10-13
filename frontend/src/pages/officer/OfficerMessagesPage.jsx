import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Mail, 
  Search, 
  Filter, 
  Eye, 
  Send, 
  Trash2, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  User,
  Phone,
  Calendar,
  MessageSquare,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function OfficerMessagesPage() {
  const { darkMode } = useApp();
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, new: 0, replied: 0 });
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, [filters, pagination.currentPage]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 10,
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.search && { search: filters.search })
      });

      const response = await axios.get(`${API_URL}/contact?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages(response.data.messages);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/contact/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleViewMessage = async (message) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/contact/${message._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedMessage(response.data);
      setShowReplyModal(true);
    } catch (error) {
      console.error('Error fetching message:', error);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;

    try {
      setReplyLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/contact/${selectedMessage._id}/reply`,
        { message: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReplyText('');
      setShowReplyModal(false);
      fetchMessages();
      fetchStats();
      alert('Reply sent successfully!');
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleUpdateStatus = async (messageId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/contact/${messageId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/contact/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMessages();
      fetchStats();
      setShowReplyModal(false);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'read': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'replied': return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'closed': return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/30';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Contact Messages
        </h1>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          Manage and respond to contact form submissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`rounded-2xl p-6 border transition-all duration-300 hover:scale-105 ${
          darkMode
            ? 'bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30'
            : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Total Messages</p>
              <p className={`text-4xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-blue-500/20' : 'bg-blue-500'}`}>
              <Mail className={`w-7 h-7 ${darkMode ? 'text-blue-400' : 'text-white'}`} />
            </div>
          </div>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>All contact submissions</p>
        </div>
        <div className={`rounded-2xl p-6 border transition-all duration-300 hover:scale-105 ${
          darkMode
            ? 'bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/30'
            : 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-lg'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>New Messages</p>
              <p className={`text-4xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.new}</p>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-yellow-500/20' : 'bg-yellow-500'}`}>
              <AlertCircle className={`w-7 h-7 ${darkMode ? 'text-yellow-400' : 'text-white'}`} />
            </div>
          </div>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Awaiting response</p>
        </div>
        <div className={`rounded-2xl p-6 border transition-all duration-300 hover:scale-105 ${
          darkMode
            ? 'bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/30'
            : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Replied</p>
              <p className={`text-4xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.replied}</p>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-green-500/20' : 'bg-green-500'}`}>
              <CheckCircle className={`w-7 h-7 ${darkMode ? 'text-green-400' : 'text-white'}`} />
            </div>
          </div>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Responses sent</p>
        </div>
      </div>

      {/* Filters */}
      <div className={`rounded-xl p-6 border transition-all duration-300 ${
        darkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-gray-200 shadow-lg'
      }`}>
        <div className="flex items-center space-x-2 mb-4">
          <Filter className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search messages..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                  darkMode
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-gray-500 focus:border-emerald-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:bg-white'
                }`}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                darkMode
                  ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500'
                  : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-emerald-500 focus:bg-white'
              }`}
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                darkMode
                  ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500'
                  : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-emerald-500 focus:bg-white'
              }`}
            >
              <option value="">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className={`rounded-xl border overflow-hidden transition-all duration-300 ${
        darkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-gray-200 shadow-lg'
      }`}>
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>No messages found</p>
          </div>
        ) : (
          <div className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-gray-200'}`}>
            {messages.map((message) => (
              <div
                key={message._id}
                className={`p-6 transition-all duration-200 cursor-pointer group ${
                  darkMode
                    ? 'hover:bg-slate-700/50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleViewMessage(message)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2 flex-wrap gap-y-2">
                      <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {message.name}
                      </h3>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(message.status)}`}>
                        {message.status}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getPriorityColor(message.priority)}`}>
                        {message.priority}
                      </span>
                    </div>
                    <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {message.email}
                    </p>
                    <p className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {message.subject}
                    </p>
                    <p className={`text-sm line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {message.message}
                    </p>
                  </div>
                  <div className="text-right ml-4 flex flex-col items-end space-y-2">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(message.createdAt).toLocaleDateString()}
                    </p>
                    {message.replies.length > 0 && (
                      <div className="flex items-center space-x-1 text-emerald-500 text-sm">
                        <MessageSquare className="w-4 h-4" />
                        <span>{message.replies.length}</span>
                      </div>
                    )}
                    <button
                      title="View Message"
                      className={`p-2 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 ${
                        darkMode
                          ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewMessage(message);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className={`p-4 border-t flex items-center justify-between ${
            darkMode ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.total)} of {pagination.total}
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                disabled={pagination.currentPage === 1}
                className={`px-3 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  darkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`px-3 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  darkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className={`rounded-2xl border max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp ${
            darkMode
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-gray-200'
          }`}>
            {/* Modal Header */}
            <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-10 ${
              darkMode
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-gray-200'
            }`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Message Details
              </h2>
              <button
                onClick={() => setShowReplyModal(false)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  darkMode
                    ? 'hover:bg-slate-700 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Sender Info */}
              <div className={`rounded-xl p-4 space-y-3 ${
                darkMode
                  ? 'bg-slate-900'
                  : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-2">
                  <User className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedMessage.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {selectedMessage.email}
                  </span>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {selectedMessage.phone}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Subject
                </label>
                <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedMessage.subject}
                </p>
              </div>

              {/* Message */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Message
                </label>
                <div className={`rounded-xl p-4 ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
                  <p className={`whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Status & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Status
                  </label>
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => handleUpdateStatus(selectedMessage._id, e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                      darkMode
                        ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-emerald-500'
                    }`}
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Priority
                  </label>
                  <span className={`inline-block px-3 py-2 rounded-lg text-sm font-semibold border ${getPriorityColor(selectedMessage.priority)}`}>
                    {selectedMessage.priority}
                  </span>
                </div>
              </div>

              {/* Previous Replies */}
              {selectedMessage.replies.length > 0 && (
                <div>
                  <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Previous Replies
                  </label>
                  <div className="space-y-3">
                    {selectedMessage.replies.map((reply, idx) => (
                      <div key={idx} className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-emerald-500">
                            {reply.repliedBy?.fullName || 'Officer'}
                          </span>
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {new Date(reply.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                          {reply.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply Form */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Send Reply
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows="4"
                  placeholder="Type your reply here..."
                  className={`w-full px-4 py-3 border rounded-xl resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                    darkMode
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-gray-500 focus:border-emerald-500'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-emerald-500'
                  }`}
                />
              </div>

              {/* Actions */}
              <div className={`flex items-center justify-between pt-4 border-t ${
                darkMode ? 'border-slate-700' : 'border-gray-200'
              }`}>
                <button
                  title="Delete Message"
                  onClick={() => handleDelete(selectedMessage._id)}
                  className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all duration-200 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
                <button
                  title="Send Reply"
                  onClick={handleReply}
                  disabled={replyLoading || !replyText.trim()}
                  className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/50"
                >
                  {replyLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Reply</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
