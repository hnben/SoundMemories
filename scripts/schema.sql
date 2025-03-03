CREATE TABLE users(
    id BIGINT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
    username VARCHAR(200) UNIQUE NOT NULL,
    pass CHAR(60) NOT NULL, -- hash, not plaintext
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE audio_files(
    id BIGINT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
    FK_userID BIGINT,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255), -- either this or external_file_url, i believe
    file_desc VARCHAR(255),
    uploaded_at DATETIME NOT NULL,
    sender VARCHAR(255),
    is_external TINYINT NOT NULL, -- 0 = false, 1 = true
    external_source VARCHAR(255), -- google drive, dropbox, mediafire, MEGA...
    external_file_id BIGINT UNIQUE, 
    external_file_url VARCHAR(255),
    FOREIGN KEY (FK_userID) REFERENCES users(id)
);

CREATE TABLE tags(
    id BIGINT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
    tag_name VARCHAR(255)
);

CREATE TABLE audio_file_tags(
    FK_audio_id BIGINT,
    FK_tag_id BIGINT,
    FOREIGN KEY (FK_audio_id) REFERENCES audio_files(id),
    FOREIGN KEY (FK_tag_id) REFERENCES tags(id),
    PRIMARY KEY (FK_audio_id, FK_tag_id)
);