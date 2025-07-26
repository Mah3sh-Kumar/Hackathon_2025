# Database Setup Instructions

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be created (this may take a few minutes)

## 2. Get Your Credentials

1. Go to Settings > API in your Supabase dashboard
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon/public key** (starts with `eyJ`)

## 3. Set Environment Variables

Create a `.env` file in your project root with:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with your actual Supabase credentials.

## 4. Create Database Tables

1. Go to your Supabase dashboard > SQL Editor
2. Run the following SQL:

```sql
-- Enable PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the sellers table
CREATE TABLE IF NOT EXISTS sellers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  business_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT,
  address TEXT,
  gst_number TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  logo_url TEXT,
  banner_url TEXT
);

-- Create the products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  images TEXT[],
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS sellers_user_id_idx ON sellers (user_id);
CREATE INDEX IF NOT EXISTS sellers_status_idx ON sellers (status);
CREATE INDEX IF NOT EXISTS products_seller_id_idx ON products (seller_id);
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);

-- Set up Row Level Security (RLS)
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for sellers table
CREATE POLICY "Allow individuals to read all sellers" 
  ON sellers FOR SELECT 
  USING (true);

CREATE POLICY "Allow individuals to insert their own seller profile" 
  ON sellers FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow individuals to update their own seller profile" 
  ON sellers FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policies for products table
CREATE POLICY "Allow individuals to read all products" 
  ON products FOR SELECT 
  USING (true);

CREATE POLICY "Allow sellers to insert their own products" 
  ON products FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sellers 
      WHERE sellers.id = products.seller_id 
      AND sellers.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow sellers to update their own products" 
  ON products FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM sellers 
      WHERE sellers.id = products.seller_id 
      AND sellers.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow sellers to delete their own products" 
  ON products FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM sellers 
      WHERE sellers.id = products.seller_id 
      AND sellers.user_id = auth.uid()
    )
  );
```

## 5. Test the Connection

1. Start your development server: `npm run dev`
2. Open the browser console
3. You should see "Supabase connection successful" instead of "Supabase connection failed"

## Troubleshooting

- If you see "Supabase credentials not found", check your `.env` file
- If you see "404" errors, make sure you've run the SQL commands
- If you see authentication errors, check that your anon key is correct 