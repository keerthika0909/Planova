create database planova1;
use planova1;
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(100) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    role ENUM('Admin','Manager','Member')
    DEFAULT 'Member',

    profile_image VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE boards (
    id INT PRIMARY KEY AUTO_INCREMENT,

    title VARCHAR(150) NOT NULL,

    description TEXT,

    created_by INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE tasks (

    id INT PRIMARY KEY AUTO_INCREMENT,

    board_id INT NOT NULL,

    title VARCHAR(200) NOT NULL,

    description TEXT,

    priority ENUM(
        'Low',
        'Medium',
        'High'
    ) DEFAULT 'Medium',

    status ENUM(
        'Todo',
        'In Progress',
        'Review',
        'Done'
    ) DEFAULT 'Todo',

    assigned_user INT,

    due_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (board_id)
    REFERENCES boards(id)
    ON DELETE CASCADE,

    FOREIGN KEY (assigned_user)
    REFERENCES users(id)
    ON DELETE SET NULL
);

CREATE TABLE task_comments (

    id INT PRIMARY KEY AUTO_INCREMENT,

    task_id INT NOT NULL,

    user_id INT NOT NULL,

    comment TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (task_id)
    REFERENCES tasks(id)
    ON DELETE CASCADE,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE notifications (

    id INT PRIMARY KEY AUTO_INCREMENT,

    user_id INT NOT NULL,

    message TEXT NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE activity_logs (

    id INT PRIMARY KEY AUTO_INCREMENT,

    user_id INT NOT NULL,

    action VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);
select * from users;
select * from boards;
select * from tasks;
select * from task_comments;
select * from notifications;
select * from activity_logs;