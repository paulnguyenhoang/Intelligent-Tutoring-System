BEGIN;


ALTER TABLE IF EXISTS public.student DROP CONSTRAINT IF EXISTS id_fkey;

ALTER TABLE IF EXISTS public.instructor DROP CONSTRAINT IF EXISTS id_fkey;

ALTER TABLE IF EXISTS public.instructor_quiz DROP CONSTRAINT IF EXISTS instructor_fkey;

ALTER TABLE IF EXISTS public.instructor_quiz DROP CONSTRAINT IF EXISTS quiz_fkey;

ALTER TABLE IF EXISTS public.quiz_attempt DROP CONSTRAINT IF EXISTS student_fkey;

ALTER TABLE IF EXISTS public.quiz_attempt DROP CONSTRAINT IF EXISTS quiz_fkey;

ALTER TABLE IF EXISTS public.question DROP CONSTRAINT IF EXISTS quiz_fkey;

ALTER TABLE IF EXISTS public.course DROP CONSTRAINT IF EXISTS course_instructor_fkey;

ALTER TABLE IF EXISTS public.lesson DROP CONSTRAINT IF EXISTS lesson_course_fkey;

ALTER TABLE IF EXISTS public.material DROP CONSTRAINT IF EXISTS material_id_fkey;

ALTER TABLE IF EXISTS public.text_material DROP CONSTRAINT IF EXISTS text_material_fkey;

ALTER TABLE IF EXISTS public.video_material DROP CONSTRAINT IF EXISTS video_material_fkey;



DROP TABLE IF EXISTS public."user";

CREATE TABLE IF NOT EXISTS public."user"
(
    id uuid NOT NULL,
    username character varying(30) NOT NULL,
    "passwordHash" character varying(72) NOT NULL,
    email character varying(254) NOT NULL,
    role smallint NOT NULL,
    "isActive" boolean NOT NULL,
    "lastLogin" timestamp with time zone,
    "verifyToken" character varying(72),
    CONSTRAINT user_pkey PRIMARY KEY (id),
    CONSTRAINT username_unique UNIQUE (username),
    CONSTRAINT email_unique UNIQUE (email)
);

COMMENT ON COLUMN public."user".role
    IS '1: Student, 2: Instructor';

DROP TABLE IF EXISTS public.student;

CREATE TABLE IF NOT EXISTS public.student
(
    id uuid NOT NULL,
    "studentID" character varying(10) NOT NULL,
    "learningStyle" smallint,
    "enrollmentDate" date,
    gpa real,
    CONSTRAINT student_id_pkey PRIMARY KEY (id),
    CONSTRAINT "studentID_unique" UNIQUE ("studentID")
);

COMMENT ON COLUMN public.student."learningStyle"
    IS '0: visual, 1: aural, 2: read_write, 3: kinesthetic';

DROP TABLE IF EXISTS public.instructor;

CREATE TABLE IF NOT EXISTS public.instructor
(
    id uuid NOT NULL,
    "employeeID" character varying(10) NOT NULL,
    department character varying(50),
    expertise character varying(50)[],
    CONSTRAINT instructor_id_pkey PRIMARY KEY (id),
    CONSTRAINT "employeeID_unique" UNIQUE ("employeeID")
);

DROP TABLE IF EXISTS public.instructor_quiz;

CREATE TABLE IF NOT EXISTS public.instructor_quiz
(
    instructor character varying NOT NULL,
    quiz uuid NOT NULL,
    CONSTRAINT instructor_quiz_pkey PRIMARY KEY (instructor, quiz)
);

DROP TABLE IF EXISTS public.quiz;

CREATE TABLE IF NOT EXISTS public.quiz
(
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    "timeLimit" integer NOT NULL,
    "minPassScore" real NOT NULL,
    "maxAttempts" integer,
    status smallint NOT NULL,
    PRIMARY KEY (id)
);

COMMENT ON COLUMN public.quiz.status
    IS '0: draft, 1: published';

DROP TABLE IF EXISTS public.quiz_attempt;

CREATE TABLE IF NOT EXISTS public.quiz_attempt
(
    "attemptID" uuid NOT NULL,
    "studentID" character varying(10) NOT NULL,
    "quizID" uuid NOT NULL,
    answers json NOT NULL,
    "totalScore" real,
    feedback character varying(255),
    "completedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT attempt_pkey PRIMARY KEY ("attemptID")
);

DROP TABLE IF EXISTS public.question;

CREATE TABLE IF NOT EXISTS public.question
(
    id uuid NOT NULL,
    quiz uuid NOT NULL,
    title character varying(255) NOT NULL,
    difficulty smallint NOT NULL,
    "correctOptionId" smallint[] NOT NULL,
    options character varying(255)[] NOT NULL,
    "isMultiSelect" boolean NOT NULL,
    tags character varying(255)[],
    hint character varying(255),
    CONSTRAINT question_pkey PRIMARY KEY (id, quiz)
);

COMMENT ON COLUMN public.question.difficulty
    IS '0: easy, 1: medium, 2: hard';

DROP TABLE IF EXISTS public.course;

CREATE TABLE IF NOT EXISTS public.course
(
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    "instructorID" character varying(10) NOT NULL,
    status smallint NOT NULL,
    "createdDate" date NOT NULL,
    tags character varying(255)[] NOT NULL,
    category character varying(255) NOT NULL,
    thumbnail bytea NOT NULL,
    PRIMARY KEY (id)
);

COMMENT ON COLUMN public.course.status
    IS '0: draft, 1: published';

DROP TABLE IF EXISTS public.lesson;

CREATE TABLE IF NOT EXISTS public.lesson
(
    id uuid NOT NULL,
    course uuid NOT NULL,
    title character varying(255) NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS public.material;

CREATE TABLE IF NOT EXISTS public.material
(
    id uuid NOT NULL,
    type smallint NOT NULL,
    PRIMARY KEY (id)
);

COMMENT ON COLUMN public.material.type
    IS '0: video, 1: text';

DROP TABLE IF EXISTS public.text_material;

CREATE TABLE IF NOT EXISTS public.text_material
(
    id uuid NOT NULL,
    content bytea NOT NULL,
    format smallint NOT NULL,
    size character varying(10) NOT NULL,
    PRIMARY KEY (id)
);

COMMENT ON COLUMN public.text_material.format
    IS '0: docs, 1: txt, 2: pdf, 3: pptx';

DROP TABLE IF EXISTS public.video_material;

CREATE TABLE IF NOT EXISTS public.video_material
(
    id uuid NOT NULL,
    url character varying(255)[] NOT NULL,
    duration integer NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.student
    ADD CONSTRAINT id_fkey FOREIGN KEY (id)
    REFERENCES public."user" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.instructor
    ADD CONSTRAINT id_fkey FOREIGN KEY (id)
    REFERENCES public."user" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.instructor_quiz
    ADD CONSTRAINT instructor_fkey FOREIGN KEY (instructor)
    REFERENCES public.instructor ("employeeID") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.instructor_quiz
    ADD CONSTRAINT quiz_fkey FOREIGN KEY (quiz)
    REFERENCES public.quiz (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.quiz_attempt
    ADD CONSTRAINT student_fkey FOREIGN KEY ("studentID")
    REFERENCES public.student ("studentID") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.quiz_attempt
    ADD CONSTRAINT quiz_fkey FOREIGN KEY ("quizID")
    REFERENCES public.quiz (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.question
    ADD CONSTRAINT quiz_fkey FOREIGN KEY (quiz)
    REFERENCES public.quiz (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.course
    ADD CONSTRAINT course_instructor_fkey FOREIGN KEY ("instructorID")
    REFERENCES public.instructor ("employeeID") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.lesson
    ADD CONSTRAINT lesson_course_fkey FOREIGN KEY (course)
    REFERENCES public.course (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.material
    ADD CONSTRAINT material_id_fkey FOREIGN KEY (id)
    REFERENCES public.lesson (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.text_material
    ADD CONSTRAINT text_material_fkey FOREIGN KEY (id)
    REFERENCES public.material (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.video_material
    ADD CONSTRAINT video_material_fkey FOREIGN KEY (id)
    REFERENCES public.material (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;

-- Seed initial users (student/admin)
-- Cleanup existing seed users if present
DELETE FROM instructor WHERE id IN ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
DELETE FROM student WHERE id IN ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
DELETE FROM "user" WHERE username IN ('student','admin');

-- student / password: student
INSERT INTO "user"(id, username, "passwordHash", email, role, "isActive", "lastLogin", "verifyToken")
VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'student', '$2b$10$R/uSU2WV.6dDe/xKFdzGWeMEuGftOM2z4Nxi6PfVmPN.4FSz4owbG', 'student@example.com', 0, true, NULL, NULL);

INSERT INTO student(id, "studentID", "learningStyle", "enrollmentDate", gpa)
VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'S000000001', NULL, NULL, NULL);

-- admin (treated as instructor) / password: admin1
INSERT INTO "user"(id, username, "passwordHash", email, role, "isActive", "lastLogin", "verifyToken")
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin', '$2b$10$wjiem6dBfPZQpMtUtKChROuv0OlDD7Pv0giXtKMU1rQpG11EtzS.q', 'admin@example.com', 1, true, NULL, NULL);

INSERT INTO instructor(id, "employeeID", department, expertise)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'EMP-0001', 'Administration', ARRAY['management']::varchar[]);

-- Seed initial quizzes (Calculus 1, Calculus 2, Linear Algebra)
-- Remove old seed data if present
DELETE FROM question WHERE quiz IN (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    '44444444-4444-4444-4444-444444444444'
);
DELETE FROM quiz WHERE id IN (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    '44444444-4444-4444-4444-444444444444'
);

-- Calculus 1
INSERT INTO quiz(id, title, "timeLimit", "minPassScore", "maxAttempts", status)
VALUES ('11111111-1111-1111-1111-111111111111', 'Calculus 1', 30, 70, 3, 1);

INSERT INTO question(id, quiz, title, difficulty, "correctOptionId", options, "isMultiSelect", tags, hint)
VALUES
('11111111-aaaa-1111-aaaa-111111111111', '11111111-1111-1111-1111-111111111111', 'Limit of (sin x)/x as x -> 0 equals?', 1, '{1}', ARRAY['0','1','Does not exist','Depends on x']::varchar[], false, NULL, 'Standard small-angle limit'),
('11111111-bbbb-1111-bbbb-111111111111', '11111111-1111-1111-1111-111111111111', 'Derivative of x^3 is?', 0, '{2}', ARRAY['2x','x^2','3x^2','x^3 ln x']::varchar[], false, NULL, 'Power rule'),
('11111111-cccc-1111-cccc-111111111111', '11111111-1111-1111-1111-111111111111', 'Product rule derivative of u*v is?', 1, '{0}', ARRAY['u''v + uv''','u''v''','u''/v + v''/u','u''v - uv''']::varchar[], false, NULL, 'Remember d(uv) = u dv + v du');

-- Calculus 2
-- Linear Algebra
INSERT INTO quiz(id, title, "timeLimit", "minPassScore", "maxAttempts", status)
VALUES ('33333333-3333-3333-3333-333333333333', 'Linear Algebra', 30, 70, 3, 1);

INSERT INTO question(id, quiz, title, difficulty, "correctOptionId", options, "isMultiSelect", tags, hint)
VALUES
('33333333-aaaa-3333-aaaa-333333333333', '33333333-3333-3333-3333-333333333333', 'Determinant of 2x2 matrix [[a,b],[c,d]] is?', 0, '{1}', ARRAY['ad + bc','ad - bc','ab - cd','a + d']::varchar[], false, NULL, 'Formula det = ad - bc'),
('33333333-bbbb-3333-bbbb-333333333333', '33333333-3333-3333-3333-333333333333', 'Dot product of (1,2) and (3,4) is?', 0, '{2}', ARRAY['3','4','11','14']::varchar[], false, NULL, '1*3 + 2*4'),
('33333333-cccc-3333-cccc-333333333333', '33333333-3333-3333-3333-333333333333', 'Eigenvalue condition for matrix A and vector v?', 2, '{0}', ARRAY['Av = λv','Av = v/λ','A + v = λ','A = λv^{-1}']::varchar[], false, NULL, 'Definition of eigenvalue/eigenvector');

-- Simple Math Demo (5 questions)
INSERT INTO quiz(id, title, "timeLimit", "minPassScore", "maxAttempts", status)
VALUES ('44444444-4444-4444-4444-444444444444', 'Math Basic', 20, 70, 3, 1);

INSERT INTO question(id, quiz, title, difficulty, "correctOptionId", options, "isMultiSelect", tags, hint)
VALUES
('44444444-aaaa-4444-aaaa-444444444444', '44444444-4444-4444-4444-444444444444', '2 + 3 = ?', 0, '{1}', ARRAY['4','5','6','7']::varchar[], false, NULL, 'Basic addition'),
('44444444-bbbb-4444-bbbb-444444444444', '44444444-4444-4444-4444-444444444444', '5 - 2 = ?', 0, '{2}', ARRAY['1','2','3','4']::varchar[], false, NULL, NULL),
('44444444-cccc-4444-cccc-444444444444', '44444444-4444-4444-4444-444444444444', '3 * 4 = ?', 0, '{3}', ARRAY['7','10','11','12']::varchar[], false, NULL, NULL),
('44444444-dddd-4444-dddd-444444444444', '44444444-4444-4444-4444-444444444444', '12 / 3 = ?', 0, '{0}', ARRAY['4','5','6','8']::varchar[], false, NULL, NULL),
('44444444-eeee-4444-eeee-444444444444', '44444444-4444-4444-4444-444444444444', 'Square root of 81 is?', 1, '{2}', ARRAY['7','8','9','10']::varchar[], false, NULL, 'Perfect square');

END;