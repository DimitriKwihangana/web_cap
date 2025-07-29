import { useState, useEffect } from 'react'
import { Users, Building, Award, User, Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react'
import axios from 'axios'

export default function AdminUsersManagement() {
  console.log('🎯 AdminUsersManagement component initialized')
  
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateLabModal, setShowCreateLabModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [stats, setStats] = useState({})

  // Create Laboratory User Form State
  const [labUserForm, setLabUserForm] = useState({
    username: '',
    email: '',
    password: '',
    organisation: '',
    position: '',
    phone: '',
    location: ''
  })
  const [labUserErrors, setLabUserErrors] = useState({})
  const [isCreatingLabUser, setIsCreatingLabUser] = useState(false)

  console.log('📊 Current state:')
  console.log('- users:', users.length)
  console.log('- filteredUsers:', filteredUsers.length)
  console.log('- loading:', loading)
  console.log('- stats:', stats)

  const userTypes = [
    { value: 'all', label: 'All Users', icon: Users, color: 'bg-gray-500' },
    { value: 'institution', label: 'Institutions', icon: Building, color: 'bg-blue-500' },
    { value: 'processor', label: 'Processors', icon: Award, color: 'bg-green-500' },
    { value: 'laboratory', label: 'Laboratories', icon: User, color: 'bg-purple-500' },
    { value: 'cooperative', label: 'Cooperatives', icon: Building, color: 'bg-orange-500' },
    { value: 'admin', label: 'Admins', icon: User, color: 'bg-red-500' }
  ]

  // Fetch users from API
  const fetchUsers = async () => {
    console.log('🚀 fetchUsers called')
    try {
      setLoading(true)
      console.log('📡 Making API call to: http://localhost:5000/api/users')
      const response = await axios.get('http://localhost:5000/api/users')
      console.log('✅ API Response:', response.data)
      
      if (response.data.status) {
        console.log('👥 Users data:', response.data.data)
        console.log('📊 Number of users:', response.data.data.length)
        setUsers(response.data.data)
        setFilteredUsers(response.data.data)
        calculateStats(response.data.data)
      } else {
        console.warn('⚠️ API returned false status:', response.data)
      }
    } catch (error) {
      console.error('❌ Error fetching users:', error)
      console.error('Error details:', error.response?.data || error.message)
    } finally {
      setLoading(false)
      console.log('✅ Loading set to false')
    }
  }

  // Calculate user statistics
  const calculateStats = (usersList) => {
    console.log('📈 calculateStats called with:', usersList)
    const statsData = usersList.reduce((acc, user) => {
      acc[user.type] = (acc[user.type] || 0) + 1
      acc.total = (acc.total || 0) + 1
      return acc
    }, {})
    console.log('📊 Calculated stats:', statsData)
    setStats(statsData)
  }

  // Filter users based on type and search term
  useEffect(() => {
    console.log('🔍 Filter useEffect triggered')
    console.log('- selectedType:', selectedType)
    console.log('- searchTerm:', searchTerm)
    console.log('- users length:', users.length)
    
    let filtered = users

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(user => user.type === selectedType)
      console.log('🏷️ After type filter:', filtered.length)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.organisation.toLowerCase().includes(searchTerm.toLowerCase())
      )
      console.log('🔍 After search filter:', filtered.length)
    }

    console.log('✅ Final filtered users:', filtered.length)
    setFilteredUsers(filtered)
  }, [users, selectedType, searchTerm])

  // Create Laboratory User
  const validateLabUserForm = () => {
    const errors = {}
    if (!labUserForm.username) errors.username = 'Username is required'
    if (!labUserForm.email) errors.email = 'Email is required'
    if (!labUserForm.password) errors.password = 'Password is required'
    if (labUserForm.password.length < 6) errors.password = 'Password must be at least 6 characters'
    if (!labUserForm.organisation) errors.organisation = 'Organization is required'
    if (!labUserForm.position) errors.position = 'Position is required'
    if (!labUserForm.phone) errors.phone = 'Phone is required'
    if (!labUserForm.location) errors.location = 'Location is required'
    
    setLabUserErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateLabUser = async (e) => {
    e.preventDefault()
    if (!validateLabUserForm()) return

    setIsCreatingLabUser(true)
    try {
      const apiData = {
        username: labUserForm.username,
        email: labUserForm.email,
        password: labUserForm.password,
        role: 'student',
        type: 'laboratory',
        organisation: labUserForm.organisation,
        position: labUserForm.position,
        phone: labUserForm.phone,
        location: labUserForm.location
      }

      const response = await axios.post('https://back-cap.onrender.com/api/register', apiData, {
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.data.status) {
        alert('Laboratory user created successfully!')
        setShowCreateLabModal(false)
        setLabUserForm({
          username: '',
          email: '',
          password: '',
          organisation: '',
          position: '',
          phone: '',
          location: ''
        })
        fetchUsers() // Refresh the users list
      } else {
        setLabUserErrors({ submit: response.data.message || 'Failed to create user' })
      }
    } catch (error) {
      console.error('Error creating lab user:', error)
      setLabUserErrors({ submit: 'Error creating user. Please try again.' })
    } finally {
      setIsCreatingLabUser(false)
    }
  }

  // View user details
  const handleViewUser = (user) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  useEffect(() => {
    console.log('🎬 Component mounted, calling fetchUsers')
    fetchUsers()
  }, [])

  console.log('🎨 About to render component')
  console.log('- loading state:', loading)
  console.log('- users count:', users.length)
  console.log('- filteredUsers count:', filteredUsers.length)

  if (loading) {
    console.log('⏳ Rendering loading state')
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  console.log('🎨 Rendering main component with data:')
  console.log('- stats:', stats)
  console.log('- filteredUsers:', filteredUsers)

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage and monitor all platform users</p>
          </div>
          <button 
            onClick={() => setShowCreateLabModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Laboratory User</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {userTypes.map(type => (
            <div key={type.value} className="bg-white/20 backdrop-blur-md p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{type.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {type.value === 'all' ? stats.total || 0 : stats[type.value] || 0}
                  </p>
                </div>
                <div className={`w-10 h-10 ${type.color} rounded-lg flex items-center justify-center`}>
                  <type.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white/20 backdrop-blur-md p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, email, or organization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/30 backdrop-blur-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              />
            </div>
            <div className="md:w-48">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 bg-white/30 backdrop-blur-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {userTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200/30">
              <thead className="bg-white/10 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white/5 backdrop-blur-sm divide-y divide-gray-200/20">
                {filteredUsers.map((user) => {
                  const userTypeInfo = userTypes.find(t => t.value === user.type) || userTypes[0]
                  return (
                    <tr key={user._id} className="hover:bg-white/10 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 ${userTypeInfo.color} rounded-full flex items-center justify-center mr-3`}>
                            <userTypeInfo.icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${userTypeInfo.color} text-white`}>
                          {userTypeInfo.label.slice(0, -1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.organisation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {user.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.courses.length} courses
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900 p-1">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No users found matching your criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Create Laboratory User Modal */}
        {showCreateLabModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white/90 backdrop-blur-md rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Create Laboratory User</h2>
                  <button
                    onClick={() => setShowCreateLabModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleCreateLabUser} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={labUserForm.username}
                        onChange={(e) => setLabUserForm({...labUserForm, username: e.target.value})}
                        className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {labUserErrors.username && <p className="text-red-600 text-sm mt-1">{labUserErrors.username}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={labUserForm.email}
                        onChange={(e) => setLabUserForm({...labUserForm, email: e.target.value})}
                        className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {labUserErrors.email && <p className="text-red-600 text-sm mt-1">{labUserErrors.email}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                    <input
                      type="password"
                      value={labUserForm.password}
                      onChange={(e) => setLabUserForm({...labUserForm, password: e.target.value})}
                      className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {labUserErrors.password && <p className="text-red-600 text-sm mt-1">{labUserErrors.password}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Organization *</label>
                      <input
                        type="text"
                        value={labUserForm.organisation}
                        onChange={(e) => setLabUserForm({...labUserForm, organisation: e.target.value})}
                        className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {labUserErrors.organisation && <p className="text-red-600 text-sm mt-1">{labUserErrors.organisation}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                      <input
                        type="text"
                        value={labUserForm.position}
                        onChange={(e) => setLabUserForm({...labUserForm, position: e.target.value})}
                        className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {labUserErrors.position && <p className="text-red-600 text-sm mt-1">{labUserErrors.position}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <input
                        type="text"
                        value={labUserForm.phone}
                        onChange={(e) => setLabUserForm({...labUserForm, phone: e.target.value})}
                        className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {labUserErrors.phone && <p className="text-red-600 text-sm mt-1">{labUserErrors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                      <input
                        type="text"
                        value={labUserForm.location}
                        onChange={(e) => setLabUserForm({...labUserForm, location: e.target.value})}
                        className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {labUserErrors.location && <p className="text-red-600 text-sm mt-1">{labUserErrors.location}</p>}
                    </div>
                  </div>

                  {labUserErrors.submit && (
                    <div className="bg-red-50/80 backdrop-blur-sm text-red-600 px-4 py-3 rounded-md text-sm">
                      {labUserErrors.submit}
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateLabModal(false)}
                      className="px-4 py-2 bg-white/50 backdrop-blur-sm text-gray-700 rounded-md hover:bg-white/70 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isCreatingLabUser}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                    >
                      {isCreatingLabUser ? 'Creating...' : 'Create Laboratory User'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white/90 backdrop-blur-md rounded-lg max-w-lg w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">User Details</h2>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser.username}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">{selectedUser.type}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">{selectedUser.role}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Organization</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.organisation}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Courses</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedUser.courses.length > 0 ? 
                        selectedUser.courses.join(', ') : 
                        'No courses enrolled'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}