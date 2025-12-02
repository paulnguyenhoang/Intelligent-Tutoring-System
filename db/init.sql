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

END;