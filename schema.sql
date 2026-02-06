-- SQL Schema for the project

-- suggestion: Consider using snake_case for all table and column names
-- (e.g., organization_users, password_hash) to avoid quoting and improve portability.

-- Create the organizations table
CREATE TABLE organizations (
    id UUID PRIMARY KEY,
    slug TEXT UNIQUE,
    name TEXT,
    plan TEXT,
    status TEXT,
    "updatedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Create the users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE,
    "passwordHash" TEXT,
    name TEXT,
    "updatedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Create the organization_users table to link users and organizations
CREATE TABLE organization_users (
    id UUID PRIMARY KEY,
    "organizationId" UUID REFERENCES organizations(id) ON DELETE CASCADE,
    "userId" UUID REFERENCES users(id) ON DELETE CASCADE,
    role TEXT,
    UNIQUE ("organizationId", "userId")
);

-- Create the patients table
CREATE TABLE patients (
    id UUID PRIMARY KEY,
    "organizationId" UUID REFERENCES organizations(id) ON DELETE CASCADE,
    phone TEXT UNIQUE,
    name TEXT,
    tags TEXT,
    "botStatus" TEXT,
    "updatedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Create the interactions table to store conversation history
CREATE TABLE interactions (
    id UUID PRIMARY KEY,
    "patientId" UUID REFERENCES patients(id) ON DELETE CASCADE,
    role TEXT NOT NULL, -- e.g., 'user', 'assistant', 'system'
    content TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- --- INDEXES ---
-- suggestion: Add indexes to frequently queried columns to improve performance.

-- Index for finding all users in an organization
CREATE INDEX idx_organization_users_organizationId ON organization_users("organizationId");

-- Index for finding all organizations for a user (if needed)
CREATE INDEX idx_organization_users_userId ON organization_users("userId");

-- Index for finding patients by organization
CREATE INDEX idx_patients_organizationId ON patients("organizationId
