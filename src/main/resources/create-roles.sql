--these are the values for the privilege and role tables
INSERT INTO privilege (id, name)
VALUES (1, 'create'),
	(2, 'read'),
	(3, 'update'),
	(4, 'delete');

INSERT INTO role (id, name)
VALUES (1, 'admin'),
	(2, 'user');

--joining values from the role and privilege tables to create an admin role
INSERT INTO role_privileges (role_id, privilege_id)
VALUES (1, 1),
	(1, 2),
	(1, 3),
	(1, 4);
