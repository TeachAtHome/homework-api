# Repository Layout

## Frontend

- teachathome-frontend
  - React App
    - bundled version in /public

## Backend

- Express Server
  - Mapping / -> /public (serve bundled frontend)
  - API Calls /api/X

## DOM

### Person

- model {person, teacher, student, parent}
- service
- resository
- route

### Storage

- service
- route

## Service Injection

- registerServices() -> all services are available in all endpoints

## Endpoints

- registerEndpoints() -> all endpoints are register centrally
- app.get('/api/person', personRoutes.getPerson)
