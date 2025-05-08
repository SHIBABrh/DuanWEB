USE realestatedb;

-- Set delimiter for stored procedures
DELIMITER //

-- Stored procedure to get paginated users
DROP PROCEDURE IF EXISTS sp_GetUsers //
CREATE PROCEDURE sp_GetUsers(
    IN p_PageNumber INT,
    IN p_PageSize INT,
    IN p_SortBy VARCHAR(50),
    IN p_SortDirection VARCHAR(4),
    IN p_SearchTerm VARCHAR(100),
    IN p_Role VARCHAR(20),
    IN p_Status VARCHAR(20)
)
BEGIN
    DECLARE v_offset INT;
    DECLARE v_query_select VARCHAR(1000);
    DECLARE v_query_where VARCHAR(1000);
    DECLARE v_query_order VARCHAR(500);
    DECLARE v_query_limit VARCHAR(100);
    DECLARE v_query_count VARCHAR(1000);
    
    -- Calculate offset
    SET v_offset = (p_PageNumber - 1) * p_PageSize;
    
    -- Base query
    SET v_query_select = CONCAT('
        SELECT 
            id, full_name, email, phone, dob, role, status, 
            address, avatar, registration_date, updated_at
        FROM 
            users
    ');
    
    -- Build WHERE clause
    SET v_query_where = ' WHERE 1=1';
    
    -- Add search filter
    IF p_SearchTerm IS NOT NULL AND p_SearchTerm != '' THEN
        SET v_query_where = CONCAT(v_query_where, ' 
            AND (
                full_name LIKE ''%', p_SearchTerm, '%'' OR 
                email LIKE ''%', p_SearchTerm, '%'' OR 
                phone LIKE ''%', p_SearchTerm, '%''
            )
        ');
    END IF;
    
    -- Add role filter
    IF p_Role IS NOT NULL AND p_Role != '' THEN
        SET v_query_where = CONCAT(v_query_where, ' AND role = ''', p_Role, '''');
    END IF;
    
    -- Add status filter
    IF p_Status IS NOT NULL AND p_Status != '' THEN
        SET v_query_where = CONCAT(v_query_where, ' AND status = ''', p_Status, '''');
    END IF;
    
    -- Build ORDER BY clause
    IF p_SortBy IS NOT NULL AND p_SortBy != '' THEN
        SET v_query_order = CONCAT(' ORDER BY ', p_SortBy);
        
        IF p_SortDirection IS NOT NULL AND (p_SortDirection = 'ASC' OR p_SortDirection = 'DESC') THEN
            SET v_query_order = CONCAT(v_query_order, ' ', p_SortDirection);
        ELSE
            SET v_query_order = CONCAT(v_query_order, ' DESC');
        END IF;
    ELSE
        SET v_query_order = ' ORDER BY registration_date DESC';
    END IF;
    
    -- Add LIMIT clause
    SET v_query_limit = CONCAT(' LIMIT ', v_offset, ', ', p_PageSize);
    
    -- Build count query
    SET v_query_count = CONCAT('
        SELECT 
            COUNT(*) AS TotalCount
        FROM 
            users
        ', v_query_where);
    
    -- Execute main query
    SET @sql_query = CONCAT(v_query_select, v_query_where, v_query_order, v_query_limit);
    PREPARE stmt FROM @sql_query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
    -- Execute count query
    SET @count_query = v_query_count;
    PREPARE stmt FROM @count_query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //

-- Stored procedure to get user by ID
DROP PROCEDURE IF EXISTS sp_GetUserById //
CREATE PROCEDURE sp_GetUserById(
    IN p_Id VARCHAR(20)
)
BEGIN
    SELECT 
        id, full_name, email, phone, dob, role, status, 
        address, avatar, registration_date, updated_at
    FROM 
        users
    WHERE 
        id = p_Id;
END //

-- Stored procedure to create a new user
DROP PROCEDURE IF EXISTS sp_CreateUser //
CREATE PROCEDURE sp_CreateUser(
    IN p_Id VARCHAR(20),
    IN p_FullName VARCHAR(100),
    IN p_Email VARCHAR(100),
    IN p_Phone VARCHAR(20),
    IN p_DOB DATE,
    IN p_Password VARCHAR(100),
    IN p_Role VARCHAR(20),
    IN p_Status VARCHAR(20),
    IN p_Address VARCHAR(255),
    IN p_Avatar LONGBLOB
)
BEGIN
    DECLARE user_exists INT DEFAULT 0;
    
    -- Check if email already exists
    SELECT COUNT(*) INTO user_exists FROM users WHERE email = p_Email;
    
    IF user_exists > 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Email đã tồn tại trong hệ thống';
    ELSE
        -- Add new user
        INSERT INTO users (
            id, full_name, email, phone, dob, password, role, 
            status, address, avatar, registration_date, updated_at
        )
        VALUES (
            p_Id, p_FullName, p_Email, p_Phone, p_DOB, p_Password, p_Role, 
            p_Status, p_Address, p_Avatar, NOW(), NOW()
        );
        
        -- Return the newly created user
        SELECT 
            id, full_name, email, phone, dob, role, status, 
            address, avatar, registration_date, updated_at
        FROM 
            users
        WHERE 
            id = p_Id;
    END IF;
END //

-- Stored procedure to update an existing user
DROP PROCEDURE IF EXISTS sp_UpdateUser //
CREATE PROCEDURE sp_UpdateUser(
    IN p_Id VARCHAR(20),
    IN p_FullName VARCHAR(100),
    IN p_Email VARCHAR(100),
    IN p_Phone VARCHAR(20),
    IN p_DOB DATE,
    IN p_Password VARCHAR(100),
    IN p_Role VARCHAR(20),
    IN p_Status VARCHAR(20),
    IN p_Address VARCHAR(255),
    IN p_Avatar LONGBLOB
)
BEGIN
    DECLARE user_exists INT DEFAULT 0;
    DECLARE email_exists INT DEFAULT 0;
    
    -- Check if user exists
    SELECT COUNT(*) INTO user_exists FROM users WHERE id = p_Id;
    
    IF user_exists = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Người dùng không tồn tại';
    ELSE
        -- Check if email exists for another user
        IF p_Email IS NOT NULL THEN
            SELECT COUNT(*) INTO email_exists FROM users WHERE email = p_Email AND id != p_Id;
            
            IF email_exists > 0 THEN
                SIGNAL SQLSTATE '45000' 
                SET MESSAGE_TEXT = 'Email đã tồn tại trong hệ thống';
            END IF;
        END IF;
        
        -- Update user information
        UPDATE users
        SET 
            full_name = COALESCE(p_FullName, full_name),
            email = COALESCE(p_Email, email),
            phone = COALESCE(p_Phone, phone),
            dob = COALESCE(p_DOB, dob),
            password = COALESCE(p_Password, password),
            role = COALESCE(p_Role, role),
            status = COALESCE(p_Status, status),
            address = COALESCE(p_Address, address),
            avatar = IF(p_Avatar IS NULL, avatar, p_Avatar),
            updated_at = NOW()
        WHERE 
            id = p_Id;
        
        -- Return updated user
        SELECT 
            id, full_name, email, phone, dob, role, status, 
            address, avatar, registration_date, updated_at
        FROM 
            users
        WHERE 
            id = p_Id;
    END IF;
END //

-- Stored procedure to delete a user
DROP PROCEDURE IF EXISTS sp_DeleteUser //
CREATE PROCEDURE sp_DeleteUser(
    IN p_Id VARCHAR(20)
)
BEGIN
    DECLARE user_exists INT DEFAULT 0;
    DECLARE v_FullName VARCHAR(100);
    DECLARE v_Email VARCHAR(100);
    
    -- Check if user exists
    SELECT COUNT(*) INTO user_exists FROM users WHERE id = p_Id;
    
    IF user_exists = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Người dùng không tồn tại';
    ELSE
        -- Store user information before deletion
        SELECT full_name, email INTO v_FullName, v_Email FROM users WHERE id = p_Id;
        
        -- Delete the user
        DELETE FROM users WHERE id = p_Id;
        
        -- Return basic information about the deleted user
        SELECT p_Id AS id, v_FullName AS full_name, v_Email AS email, 'DELETED' AS status;
    END IF;
END //

-- Stored procedure to update user status
DROP PROCEDURE IF EXISTS sp_UpdateUserStatus //
CREATE PROCEDURE sp_UpdateUserStatus(
    IN p_Id VARCHAR(20),
    IN p_Status VARCHAR(20)
)
BEGIN
    DECLARE user_exists INT DEFAULT 0;
    
    -- Check if user exists
    SELECT COUNT(*) INTO user_exists FROM users WHERE id = p_Id;
    
    IF user_exists = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Người dùng không tồn tại';
    ELSE
        -- Update user status
        UPDATE users
        SET 
            status = p_Status,
            updated_at = NOW()
        WHERE 
            id = p_Id;
        
        -- Return updated user
        SELECT 
            id, full_name, email, phone, dob, role, status, 
            address, avatar, registration_date, updated_at
        FROM 
            users
        WHERE 
            id = p_Id;
    END IF;
END //

-- Stored procedure to update user role
DROP PROCEDURE IF EXISTS sp_UpdateUserRole //
CREATE PROCEDURE sp_UpdateUserRole(
    IN p_Id VARCHAR(20),
    IN p_Role VARCHAR(20)
)
BEGIN
    DECLARE user_exists INT DEFAULT 0;
    
    -- Check if user exists
    SELECT COUNT(*) INTO user_exists FROM users WHERE id = p_Id;
    
    IF user_exists = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Người dùng không tồn tại';
    ELSE
        -- Update user role
        UPDATE users
        SET 
            role = p_Role,
            updated_at = NOW()
        WHERE 
            id = p_Id;
        
        -- Return updated user
        SELECT 
            id, full_name, email, phone, dob, role, status, 
            address, avatar, registration_date, updated_at
        FROM 
            users
        WHERE 
            id = p_Id;
    END IF;
END //

-- Stored procedure to update user avatar
DROP PROCEDURE IF EXISTS sp_UpdateUserAvatar //
CREATE PROCEDURE sp_UpdateUserAvatar(
    IN p_Id VARCHAR(20),
    IN p_Avatar LONGBLOB
)
BEGIN
    DECLARE user_exists INT DEFAULT 0;
    
    -- Check if user exists
    SELECT COUNT(*) INTO user_exists FROM users WHERE id = p_Id;
    
    IF user_exists = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Người dùng không tồn tại';
    ELSE
        -- Update user avatar
        UPDATE users
        SET 
            avatar = p_Avatar,
            updated_at = NOW()
        WHERE 
            id = p_Id;
        
        -- Return updated user
        SELECT 
            id, full_name, email, phone, dob, role, status, 
            address, avatar, registration_date, updated_at
        FROM 
            users
        WHERE 
            id = p_Id;
    END IF;
END //

-- Reset delimiter
DELIMITER ; 