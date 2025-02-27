INSERT INTO users(username, pass, email) VALUES 
('cheeseman45', '$2b$10$0jtAoU.gsZ/Fjz0196DS1.IxbJU/oK28.YGmCej/oblOFsyHSAsQu', 'cheeseman45@email.com'),
('platopatriot', '$2b$10$gwXu28wp35nfO3lc0YT6oOv5jzfEdHzX4ueQTFIDyqk9gdtKxRqwq', 'plpat@123.com'),
('panda_lover_222222', '$2b$10$YvF/Z8gMScUcgj0pq2nheeizSa2jSCYdR8ZW6BJaH8XyZgJm/VqNy', 'amanda@healthbank.org'),
('jdavies', '$2b$10$5uecNWx1rZeFowD5NOQ4nOjOEtfXdRvBuCMCIxxjrJFRizD5esMZO', 'jonatan.davies@school.edu'),
('user123fortynine', '$2b$10$E2l..GydByZaUxU1NT3xFuHEpIJvfkOJWKal681.lxOh9nZ.fargq', 'pizzaplacesnearme@hungrymail.com');

INSERT INTO audio_files(FK_userID, file_name, file_path, file_desc, uploaded_at, sender, is_external) VALUES
(1, 'encouraging.mp3', 'Files/encouraging.mp3', 'An encouraging message of support from your buddy David', NOW(), 'David Jarvis', 0),
(1, 'happy.mp3', 'Files/happy.mp3', 'An uplifting message from Grandma Pam', NOW(), 'Grandma Pam', 0),
(1, 'random.mp3', 'Files/random.mp3', 'A funny soundbyte from your older brother Joe', NOW(), 'Joe Schmoe', 0),
(1, 'sad.mp3', 'Files/sad.mp3', 'Something to listen to when you''re feeling blue', NOW(), 'Mom', 0);

INSERT INTO tags(tag_name) VALUES 
('encouraging'),
('happy'),
('random'),
('sad');

INSERT INTO audio_file_tags(FK_audio_id, FK_tag_id) VALUES 
(1, 1),
(2, 2),
(3, 3),
(4, 4);