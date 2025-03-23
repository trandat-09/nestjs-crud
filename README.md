# Kobizo

Kobizo is a multi-tenant application designed to manage tenants, users, and tasks efficiently. The addition of tenants serves two primary purposes:

1. **SaaS-Based Product**: By introducing tenants, Kobizo becomes a scalable SaaS product that can be sold to different customers, each operating independently within their own tenant environment.
2. **Enhanced Access Control**: Tenants enable stricter access checks, ensuring that users can only access resources under their assigned tenant and based on their role permissions.

## Key Features

1. **Tenant Management**:

   - Create and manage tenants.
   - Each tenant operates in isolation, ensuring data security and privacy.

2. **User Management**:

   - Create users that belong to specific tenants.
   - Role-based access control for users within a tenant.

3. **Task Management**:
   - Assign tasks to users within a tenant.
   - Track and manage tasks efficiently.

## Business Use Case

Kobizo is designed for businesses that want to offer task and user management services to multiple clients (tenants). Each tenant can have its own set of users and tasks, making it easy to scale the product for multiple organizations. This architecture ensures that tenants' data is isolated and secure, enabling businesses to sell this product to many users without compromising on performance or security.

## Scalability

- **Multi-Tenant Architecture**: The platform is built to support multiple tenants, making it easy to scale as the number of clients grows.
- **Containerized Deployment**: Using Docker, the application can be deployed and scaled effortlessly across different environments.
- **Modular Design**: The codebase is structured to allow easy addition of new features and services.

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd kobizo
   ```

2. Start the application using Docker Compose:

   ```bash
   docker-compose up --build
   ```

3. Access the application at `http://localhost:3001`.

## Future Enhancements

- Advanced analytics and reporting for tenants.
- Integration with third-party services for enhanced functionality.
- Improved user interface for better user experience.
- Permission-Based Access: Allow users to call APIs based on their permissions within their tenant and role.

## License

This project is licensed under the MIT License.
