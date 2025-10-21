PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS user_profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    display_name TEXT NOT NULL,
    timezone TEXT,
    birthdate TEXT,
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dreams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    narrative TEXT,
    mood TEXT,
    lucidity_level INTEGER,
    sleep_quality INTEGER,
    dream_date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_profile(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dream_symbols (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dream_id INTEGER,
    symbol TEXT NOT NULL,
    meaning TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dream_id) REFERENCES dreams(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alarms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    label TEXT,
    alarm_time TEXT NOT NULL,
    recurrence TEXT,
    enabled INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_profile(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS horoscopes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    zodiac_sign TEXT NOT NULL,
    reading_date TEXT NOT NULL,
    summary TEXT,
    compatibility TEXT,
    lucky_numbers TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_profile(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS synchronicities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dream_id INTEGER,
    description TEXT NOT NULL,
    occurred_on TEXT,
    correlation_score REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dream_id) REFERENCES dreams(id) ON DELETE SET NULL
);

CREATE TRIGGER IF NOT EXISTS update_user_profile_timestamp
AFTER UPDATE ON user_profile
FOR EACH ROW
BEGIN
    UPDATE user_profile SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS update_dreams_timestamp
AFTER UPDATE ON dreams
FOR EACH ROW
BEGIN
    UPDATE dreams SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS update_alarms_timestamp
AFTER UPDATE ON alarms
FOR EACH ROW
BEGIN
    UPDATE alarms SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS update_horoscopes_timestamp
AFTER UPDATE ON horoscopes
FOR EACH ROW
BEGIN
    UPDATE horoscopes SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
