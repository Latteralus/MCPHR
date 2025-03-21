import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { DatabaseService } from '../../services/DatabaseService';
import { License } from '../../types';
import './Licenses.css';

interface LicenseWithDetails extends License {
  employeeName: string;
  daysUntilExpiration: number;
}

const LicenseList: React.FC = () => {
  const [licenses, setLicenses] = useState<LicenseWithDetails[]>([]);
  const [filteredLicenses, setFilteredLicenses] = useState<LicenseWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [licenseTypes, setLicenseTypes] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [expiryFilter, setExpiryFilter] = useState<string>('all');
  
  const dbService = new DatabaseService();
  
  useEffect(() => {
    const fetchLicenses = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        await dbService.openDatabase();
        
        // Join licenses with employees and users to get employee name
        const query = `
          SELECT 
            l.id, l.employee_id, l.license_type, l.license_number, 
            l.issue_date, l.expiration_date, l.issuing_authority, l.status,
            l.created_at, l.updated_at,
            u.first_name, u.last_name
          FROM licenses l
          JOIN employees e ON l.employee_id = e.id
          LEFT JOIN users u ON e.user_id = u.id
          ORDER BY l.expiration_date ASC
        `;
        
        const licenseData = dbService.executeQuery(query);
        
        // Get the current date for calculating days until expiration
        const today = new Date();
        
        // Transform the license data
        const licenseList: LicenseWithDetails[] = licenseData.map((license) => {
          const expirationDate = new Date(license.expiration_date);
          const daysUntilExpiration = Math.ceil(
            (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          return {
            id: license.id,
            employeeId: license.employee_id,
            licenseType: license.license_type,
            licenseNumber: license.license_number,
            issueDate: license.issue_date,
            expirationDate: license.expiration_date,
            issuingAuthority: license.issuing_authority,
            status: license.status,
            createdAt: license.created_at,
            updatedAt: license.updated_at,
            employeeName: `${license.first_name} ${license.last_name}`,
            daysUntilExpiration
          };
        });
        
        setLicenses(licenseList);
        setFilteredLicenses(licenseList);
        
        // Extract unique license types for filter
        const uniqueTypes = [...new Set(licenseList.map(lic => lic.licenseType))];
        setLicenseTypes(uniqueTypes);
      } catch (err) {
        console.error('Error fetching licenses:', err);
        setError('Failed to load licenses. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLicenses();
  }, []);
  
  // Apply filters when search or filters change
  useEffect(() => {
    let filtered = [...licenses];
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(lic => 
        lic.employeeName.toLowerCase().includes(searchLower) ||
        lic.licenseType.toLowerCase().includes(searchLower) ||
        lic.licenseNumber.toLowerCase().includes(searchLower) ||
        lic.issuingAuthority.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lic => lic.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(lic => lic.licenseType === typeFilter);
    }
    
    // Apply expiry filter
    if (expiryFilter !== 'all') {
      if (expiryFilter === 'expired') {
        filtered = filtered.filter(lic => lic.daysUntilExpiration < 0);
      } else if (expiryFilter === '30days') {
        filtered = filtered.filter(lic => lic.daysUntilExpiration >= 0 && lic.daysUntilExpiration <= 30);
      } else if (expiryFilter === '90days') {
        filtered = filtered.filter(lic => lic.daysUntilExpiration > 30 && lic.daysUntilExpiration <= 90);
      } else if (expiryFilter === 'valid') {
        filtered = filtered.filter(lic => lic.daysUntilExpiration > 90);
      }
    }
    
    setFilteredLicenses(filtered);
  }, [searchTerm, statusFilter, typeFilter, expiryFilter, licenses]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };
  
  const handleTypeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value);
  };
  
  const handleExpiryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExpiryFilter(e.target.value);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setExpiryFilter('all');
  };
  
  // Calculate expiration alert class
  const getExpirationAlertClass = (daysUntilExpiration: number): string => {
    if (daysUntilExpiration < 0) return 'expired';
    if (daysUntilExpiration <= 30) return 'critical';
    if (daysUntilExpiration <= 90) return 'warning';
    return 'normal';
  };
  
  // Format the expiration display
  const formatExpirationDisplay = (days: number): string => {
    if (days < 0) {
      return `Expired ${Math.abs(days)} days ago`;
    }
    if (days === 0) {
      return 'Expires today';
    }
    return `Expires in ${days} days`;
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <LoadingSpinner message="Loading licenses..." />
      </MainLayout>
    );
  }
  
  if (error) {
    return (
      <MainLayout>
        <div className="error-message">{error}</div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="license-list-container">
        <div className="license-list-header">
          <h1>Licenses</h1>
          <button className="primary">
            <span className="button-icon">➕</span>
            Add License
          </button>
        </div>
        
        {/* Summary widgets */}
        <div className="license-summary">
          <div className="summary-card critical">
            <div className="summary-icon">⚠️</div>
            <div className="summary-info">
              <h3>{licenses.filter(lic => lic.daysUntilExpiration < 0).length}</h3>
              <p>Expired</p>
            </div>
          </div>
          
          <div className="summary-card warning">
            <div className="summary-icon">⚠️</div>
            <div className="summary-info">
              <h3>{licenses.filter(lic => lic.daysUntilExpiration >= 0 && lic.daysUntilExpiration <= 30).length}</h3>
              <p>Expiring in 30 days</p>
            </div>
          </div>
          
          <div className="summary-card normal">
            <div className="summary-icon">✅</div>
            <div className="summary-info">
              <h3>{licenses.filter(lic => lic.daysUntilExpiration > 30).length}</h3>
              <p>Valid</p>
            </div>
          </div>
        </div>
        
        <div className="filter-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search licenses..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="filter-selects">
            <div className="filter-group">
              <label htmlFor="status-filter">Status</label>
              <select 
                id="status-filter"
                value={statusFilter}
                onChange={handleStatusFilter}
              >
                <option value="revoked">Revoked</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="type-filter">License Type</label>
              <select 
                id="type-filter"
                value={typeFilter}
                onChange={handleTypeFilter}
              >
                <option value="all">All Types</option>
                {licenseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="expiry-filter">Expiration</label>
              <select 
                id="expiry-filter"
                value={expiryFilter}
                onChange={handleExpiryFilter}
              >
                <option value="all">All</option>
                <option value="expired">Expired</option>
                <option value="30days">Expiring in 30 days</option>
                <option value="90days">Expiring in 31-90 days</option>
                <option value="valid">Valid (90+ days)</option>
              </select>
            </div>
            
            <button 
              className="secondary clear-filter-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
        
        <div className="license-count">
          Showing {filteredLicenses.length} of {licenses.length} licenses
        </div>
        
        <div className="license-table-container">
          <table className="license-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>License Type</th>
                <th>License Number</th>
                <th>Issuing Authority</th>
                <th>Issue Date</th>
                <th>Expiration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLicenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="no-results">
                    No licenses found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredLicenses.map(license => (
                  <tr key={license.id}>
                    <td>{license.employeeName}</td>
                    <td>{license.licenseType}</td>
                    <td>{license.licenseNumber}</td>
                    <td>{license.issuingAuthority}</td>
                    <td>{new Date(license.issueDate).toLocaleDateString()}</td>
                    <td>
                      <div className={`expiry-date ${getExpirationAlertClass(license.daysUntilExpiration)}`}>
                        <div>{new Date(license.expirationDate).toLocaleDateString()}</div>
                        <div className="expiry-countdown">
                          {formatExpirationDisplay(license.daysUntilExpiration)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${license.status}`}>
                        {formatStatus(license.status)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link 
                          to={`/licenses/${license.id}`} 
                          className="action-button view"
                          title="View License"
                        >
                          👁️
                        </Link>
                        <Link 
                          to={`/licenses/${license.id}/edit`} 
                          className="action-button edit"
                          title="Edit License"
                        >
                          ✏️
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

// Helper function to format status
const formatStatus = (status: string): string => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'expired':
      return 'Expired';
    case 'pending':
      return 'Pending';
    case 'revoked':
      return 'Revoked';
    default:
      return status;
  }
};

export default LicenseList; value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="pending">Pending</option>
                <option