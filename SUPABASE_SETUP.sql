-- Run this in your Supabase SQL Editor to fix 'Permission denied' or 'Invalid path' errors:

-- 1. Create the 'profiles' table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create the 'videos' table
CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID,
    video_url TEXT,
    url TEXT,
    description TEXT,
    username TEXT,
    avatar TEXT,
    likes TEXT DEFAULT '0',
    comments TEXT DEFAULT '0',
    shares TEXT DEFAULT '0',
    bookmarks TEXT DEFAULT '0',
    sound_name TEXT,
    soundName TEXT
);

-- 3. Create the 'follows' table
CREATE TABLE IF NOT EXISTS follows (
    follower_id UUID REFERENCES auth.users(id),
    following_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id)
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- 5. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 6. Videos Policies
CREATE POLICY "Videos are viewable by everyone" ON videos FOR SELECT USING (true);
CREATE POLICY "Anyone can insert videos" ON videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update/delete own videos" ON videos FOR ALL USING (auth.uid() = user_id);

-- 7. Follows Policies
CREATE POLICY "Follows are viewable by everyone" ON follows FOR SELECT USING (true);
CREATE POLICY "Users can follow others" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow others" ON follows FOR DELETE USING (auth.uid() = follower_id);
