# Admin Notifications System Implementation

## Overview
This document describes the implementation of the dynamic admin notifications system for the PremiAds gamified platform.

## Architecture

### Database Structure

#### `admin_notification_settings` Table
```sql
CREATE TABLE admin_notification_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value BOOLEAN NOT NULL DEFAULT true,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Default Settings:**
- `global_notifications_enabled`: Controls all notifications system-wide
- `user_notifications_enabled`: Controls user-related notifications (campaigns, submissions, payments, achievements)
- `system_notifications_enabled`: Controls system-related notifications (security, system alerts)

#### Functions
1. **`send_notification_to_users()`**: Sends notifications to users based on target type
2. **`is_notification_enabled()`**: Checks if a specific notification setting is enabled

### Frontend Components

#### `useAdminNotifications` Hook (`src/hooks/admin/useAdminNotifications.ts`)
**Features:**
- Send notifications to specific user groups
- Manage notification settings (global controls)
- Fetch notification history with pagination
- Real-time settings synchronization

**Key Methods:**
```typescript
interface useAdminNotifications {
  // Actions
  sendNotification(data: SendNotificationData): Promise<Result>
  getSettings(): Promise<Result>
  updateSettings(settings: Partial<NotificationSettings>): Promise<Result>
  toggleSetting(key: keyof NotificationSettings): Promise<Result>
  getNotificationsHistory(page: number, limit: number): Promise<Result>
  
  // State
  isLoading: boolean
  settings: NotificationSettings | null
  notifications: AdminNotification[]
  pagination: PaginationInfo | null
}
```

#### Updated `NotificationsPage` Component (`src/pages/admin/NotificationsPage.tsx`)
**Features:**
- **Send Tab**: Form to send custom notifications with target audience selection
- **Settings Tab**: Toggle switches for global notification controls
- **History Tab**: Paginated history of sent notifications

**UI Elements:**
- Target audience dropdown: "Todos os usuários", "Anunciantes", "Participantes"
- Global settings switches with descriptions
- Real-time form validation
- Success/error feedback

#### `useClientNotifications` Hook (Updated)
**New Features:**
- Respects admin notification settings
- Filters notifications based on enabled categories
- Real-time admin settings synchronization
- Automatic fallback to enabled state if settings unavailable

### Edge Function: `admin-notifications`

**Endpoints:**
1. **`send_notification`**: Distributes notifications to target users
2. **`get_settings`**: Retrieves current admin settings
3. **`update_settings`**: Updates notification settings
4. **`get_notifications_history`**: Returns paginated history

**Request Format:**
```typescript
interface AdminNotificationRequest {
  action: 'send_notification' | 'get_settings' | 'update_settings' | 'get_notifications_history'
  title?: string
  message?: string
  target_type?: 'all' | 'advertisers' | 'participants'
  settings?: Record<string, boolean>
  page?: number
  limit?: number
}
```

## Data Flow

### Sending Notifications
1. Admin fills form in NotificationsPage
2. `sendNotification()` calls admin-notifications Edge Function
3. Edge Function calls `send_notification_to_users()` database function
4. Database function:
   - Checks if global notifications are enabled
   - Filters users by target type and active status
   - Creates individual notification records
   - Returns recipient count
5. Admin log entry created for history tracking
6. Real-time distribution via Supabase Realtime
7. Client notifications filtered by admin settings

### Settings Management
1. Admin toggles switches in Settings tab
2. `updateSettings()` calls Edge Function
3. Database settings updated with timestamp
4. Real-time sync triggers client setting reload
5. Client notifications immediately filter based on new settings

### Client Notification Filtering
```typescript
// Example filtering logic
const allowedCategories = []
if (adminSettings.user_notifications_enabled) {
  allowedCategories.push('campaign', 'submission', 'payment', 'user', 'achievement')
}
if (adminSettings.system_notifications_enabled) {
  allowedCategories.push('system', 'security')
}
```

## Security Features

- **RLS (Row Level Security)**: All tables have appropriate access policies
- **Function Security**: Database functions use `SECURITY DEFINER`
- **Edge Function Auth**: Requires valid authorization header
- **User Type Validation**: Target filtering validates user types
- **Admin-only Access**: Notification management restricted to admin role

## Real-time Features

- **Supabase Realtime Channels**: Instant notification delivery
- **Settings Synchronization**: Admin setting changes propagate immediately
- **Live UI Updates**: Notification counts and content update in real-time
- **Cross-device Sync**: Settings changes visible across all admin sessions

## Monitoring & Analytics

### Admin Dashboard Metrics
- Total notifications sent per time period
- Delivery success rates by user type
- Settings change history
- Popular notification types

### Logs & Debugging
- All admin notification sends logged with metadata
- Error tracking for failed deliveries
- Performance monitoring for bulk sends
- Audit trail for settings changes

## Usage Examples

### Send Notification to All Advertisers
```typescript
const result = await sendNotification({
  title: "Nova atualização disponível",
  message: "Confira as novas funcionalidades no painel do anunciante",
  target_type: 'advertisers'
})
```

### Toggle Global Notifications
```typescript
const result = await toggleSetting('global_notifications_enabled')
```

### Get Notification History
```typescript
const result = await getNotificationsHistory(1, 20)
// Returns: { notifications: [...], pagination: { page: 1, total: 150, pages: 8 } }
```

## Integration Points

### Existing Systems
- **Client Notifications**: Full backward compatibility maintained
- **Advertiser Notifications**: Independent system, no conflicts
- **Database Triggers**: Continue working, subject to admin settings
- **Edge Functions**: Smart-notifications enhanced with admin controls

### Future Enhancements
- **Scheduled Notifications**: Time-based delivery
- **Template System**: Reusable notification templates
- **A/B Testing**: Split testing for notification effectiveness
- **Advanced Analytics**: Detailed engagement metrics
- **Push Notifications**: Mobile app integration ready

## Testing

### Unit Tests
- Hook functionality with mocked Supabase client
- Edge Function logic with test scenarios
- Database function validation

### Integration Tests
- End-to-end notification flow
- Settings synchronization across components
- Real-time delivery verification

### Manual Testing Scenarios
1. Send notification to each target type
2. Toggle each setting and verify client behavior
3. Test pagination in history view
4. Verify real-time updates across browser tabs
5. Test error handling for invalid inputs

## Performance Considerations

- **Batch Processing**: Large user groups handled efficiently
- **Database Indexing**: Optimized queries for user filtering
- **Caching**: Admin settings cached on client side
- **Rate Limiting**: Edge Function includes basic rate limiting
- **Memory Management**: Pagination prevents large data loads

## Maintenance

### Regular Tasks
- Monitor notification delivery rates
- Review and archive old notification history
- Update user type classifications as needed
- Optimize database queries based on usage patterns

### Troubleshooting
- Check admin settings if notifications not appearing
- Verify user `active` status for delivery issues
- Review Edge Function logs for errors
- Monitor Supabase Realtime connection health

This implementation provides a robust, scalable, and user-friendly admin notification system that integrates seamlessly with the existing PremiAds platform architecture. 