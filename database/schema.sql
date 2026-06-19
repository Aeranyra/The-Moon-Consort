-- USERS
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(20) NOT NULL,
    guild_id VARCHAR(20) NOT NULL,
    reputation VARCHAR(50) DEFAULT 'None',
    mischief_count INT DEFAULT 0,
    haunt_count INT DEFAULT 0,
    divorce_count INT DEFAULT 0,
    bonds_broken INT DEFAULT 0,
    moon_favor BOOLEAN DEFAULT FALSE,
    highest_bond INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, guild_id)
);

-- BONDS
CREATE TABLE IF NOT EXISTS bonds (
    user1_id VARCHAR(20) NOT NULL,
    user2_id VARCHAR(20) NOT NULL,
    guild_id VARCHAR(20) NOT NULL,
    score INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user1_id, user2_id, guild_id)
);

-- MARRIAGES
CREATE TABLE IF NOT EXISTS marriages (
    id SERIAL PRIMARY KEY,
    user1_id VARCHAR(20) NOT NULL,
    user2_id VARCHAR(20) NOT NULL,
    guild_id VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- PROPOSALS
CREATE TABLE IF NOT EXISTS proposals (
    id SERIAL PRIMARY KEY,
    from_id VARCHAR(20) NOT NULL,
    to_id VARCHAR(20) NOT NULL,
    guild_id VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- FAMILY
CREATE TABLE IF NOT EXISTS family (
    parent_id VARCHAR(20) NOT NULL,
    child_id VARCHAR(20) NOT NULL,
    guild_id VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (parent_id, child_id, guild_id)
);

-- BUTTERFLIES
CREATE TABLE IF NOT EXISTS butterflies (
    user_id VARCHAR(20) NOT NULL,
    guild_id VARCHAR(20) NOT NULL,
    white INT DEFAULT 0,
    pink INT DEFAULT 0,
    black INT DEFAULT 0,
    silver INT DEFAULT 0,
    gold INT DEFAULT 0,
    PRIMARY KEY (user_id, guild_id)
);

-- MEMORIES
CREATE TABLE IF NOT EXISTS memories (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    guild_id VARCHAR(20) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    related_user_id VARCHAR(20),
    occurred_at TIMESTAMP DEFAULT NOW()
);

-- VOWS
CREATE TABLE IF NOT EXISTS vows (
    user_id VARCHAR(20) NOT NULL,
    guild_id VARCHAR(20) NOT NULL,
    content TEXT,
    updated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, guild_id)
);

-- GIFTS
CREATE TABLE IF NOT EXISTS gifts (
    user_id VARCHAR(20) NOT NULL,
    guild_id VARCHAR(20) NOT NULL,
    gifts_given INT DEFAULT 0,
    gifts_received INT DEFAULT 0,
    last_gift VARCHAR(50),
    PRIMARY KEY (user_id, guild_id)
);

-- BLESSINGS
CREATE TABLE IF NOT EXISTS blessings (
    user_id VARCHAR(20) NOT NULL,
    guild_id VARCHAR(20) NOT NULL,
    blessings_given INT DEFAULT 0,
    blessings_received INT DEFAULT 0,
    last_blessed_at TIMESTAMP,
    PRIMARY KEY (user_id, guild_id)
);

-- CHALLENGES
CREATE TABLE IF NOT EXISTS challenges (
    id SERIAL PRIMARY KEY,
    challenger_id VARCHAR(20) NOT NULL,
    target_id VARCHAR(20) NOT NULL,
    guild_id VARCHAR(20) NOT NULL,
    channel_id VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- BOT STATE (V2 mood system placeholder)
CREATE TABLE IF NOT EXISTS bot_state (
    guild_id VARCHAR(20) PRIMARY KEY,
    mood VARCHAR(20) DEFAULT 'Regal',
    updated_at TIMESTAMP DEFAULT NOW()
);
