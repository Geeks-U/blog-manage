# 博客相关的数据结构

```sql

CREATE TABLE articles (
  id uuid PRIMARY KEY,
  title TEXT(100) NOT NULL,
  content TEXT(200),
  excerpt TEXT,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE topics (
  id uuid PRIMARY KEY,
  name TEXT(100) NOT NULL UNIQUE
);

CREATE TABLE article_topic (
  article_id uuid not null,
  topic_id uuid not null,
  PRIMARY KEY (article_id, topic_id)
);

```