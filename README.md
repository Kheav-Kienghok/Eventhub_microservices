# Event System Application

## Description

The **Event System Application** is a platform that allows users to easily create, manage, and register for events. It aims to simplify the event management process for both organizers and attendees by providing a streamlined interface and powerful features for event scheduling, user registration, and more.

## Features

- **User Registration/Login**: Users can create accounts and log in to the platform.
- **Event Creation**: Organizers can create events, specify dates, times, and other details.
- **Event Registration**: Attendees can browse and register for events of interest.
- **Admin Panel**: Admin users can view and manage events, user registrations, and other system resources.

## Tech Stack

- **Frontend**: Postman
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Hosting/Deployment**: Docker, AWS, Kubernetes (Minikube) (localhost)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/kheav-kienghok/event-system-application.git
cd event-system-application
```


### 2. Run 
You need to have docker installed on your machine and also minikube as well
```bash
    minikube start
    minikube dashboard
```

```bash
    kubectl apply -f k8s/
```
