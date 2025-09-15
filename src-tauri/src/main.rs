// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::PathBuf;
use std::sync::Mutex;
use rusqlite::{Connection, Result as SqliteResult};
use serde::{Deserialize, Serialize};
use tauri::{Manager, State};
use chrono::{DateTime, Utc};

// Database connection wrapper
pub struct DatabaseConnection(pub Mutex<Connection>);

// Data structures matching the schema
#[derive(Debug, Serialize, Deserialize)]
pub struct Client {
    pub id: String,
    pub name: String,
    pub tags: Vec<String>,
    pub contacts: Vec<String>,
    pub links: Vec<String>,
    pub next_step: Option<String>,
    pub next_step_due: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Task {
    pub id: String,
    pub project_id: Option<String>,
    pub client_id: Option<String>,
    pub title: String,
    pub description: Option<String>,
    pub status: String,
    pub due: Option<String>,
    pub priority: Option<i32>,
    pub effort: Option<f64>,
    pub impact: Option<i32>,
    pub confidence: Option<f64>,
    pub is_next_step: bool,
    pub tags: Vec<String>,
    pub links: Vec<String>,
    pub created_at: String,
    pub updated_at: String,
    pub score: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Project {
    pub id: String,
    pub client_id: Option<String>,
    pub kind: String,
    pub project_type: Option<String>,
    pub status: Option<String>,
    pub title: String,
    pub description: Option<String>,
    pub tags: Vec<String>,
    pub next_step: Option<String>,
    pub next_step_due: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

// Tauri commands
#[tauri::command]
async fn init_database(app_handle: tauri::AppHandle) -> Result<String, String> {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .ok_or("Failed to get app data directory")?;
    
    std::fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
    
    let db_path = app_dir.join("planner.db");
    let conn = Connection::open(&db_path).map_err(|e| e.to_string())?;
    
    // Initialize database schema
    init_schema(&conn).map_err(|e| e.to_string())?;
    
    app_handle.manage(DatabaseConnection(Mutex::new(conn)));
    
    Ok(db_path.to_string_lossy().to_string())
}

#[tauri::command]
async fn get_tasks(db: State<'_, DatabaseConnection>) -> Result<Vec<Task>, String> {
    let conn = db.0.lock().unwrap();
    let mut stmt = conn
        .prepare("SELECT * FROM tasks ORDER BY created_at DESC")
        .map_err(|e| e.to_string())?;
    
    let task_iter = stmt
        .query_map([], |row| {
            Ok(Task {
                id: row.get(0)?,
                project_id: row.get(1)?,
                client_id: row.get(2)?,
                title: row.get(3)?,
                description: row.get(4)?,
                status: row.get(5)?,
                due: row.get(6)?,
                priority: row.get(7)?,
                effort: row.get(8)?,
                impact: row.get(9)?,
                confidence: row.get(10)?,
                is_next_step: row.get(11)?,
                tags: serde_json::from_str(&row.get::<_, String>(12)?).unwrap_or_default(),
                links: serde_json::from_str(&row.get::<_, String>(13)?).unwrap_or_default(),
                created_at: row.get(14)?,
                updated_at: row.get(15)?,
                score: row.get(16)?,
            })
        })
        .map_err(|e| e.to_string())?;
    
    let mut tasks = Vec::new();
    for task in task_iter {
        tasks.push(task.map_err(|e| e.to_string())?);
    }
    
    Ok(tasks)
}

#[tauri::command]
async fn create_task(task: Task, db: State<'_, DatabaseConnection>) -> Result<Task, String> {
    let conn = db.0.lock().unwrap();
    let now = Utc::now().to_rfc3339();
    let id = uuid::Uuid::new_v4().to_string();
    
    conn.execute(
    "INSERT INTO tasks (id, project_id, client_id, title, description, status, due, priority, effort, impact, confidence, is_next_step, tags, links, created_at, updated_at, score) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17)",
    rusqlite::params![
        &id,
        &task.project_id,
        &task.client_id,
        &task.title,
        &task.description,
        &task.status,
        &task.due,
        &task.priority,
        &task.effort,
        &task.impact,
        &task.confidence,
        &task.is_next_step,
        &serde_json::to_string(&task.tags).unwrap(),
        &serde_json::to_string(&task.links).unwrap(),
        &now,
        &now,
        &task.score,
    ],
    ).map_err(|e| e.to_string())?;

    
    Ok(Task {
        id,
        created_at: now.clone(),
        updated_at: now,
        ..task
    })
}

#[tauri::command]
async fn get_clients(db: State<'_, DatabaseConnection>) -> Result<Vec<Client>, String> {
    let conn = db.0.lock().unwrap();
    let mut stmt = conn
        .prepare("SELECT * FROM clients ORDER BY name")
        .map_err(|e| e.to_string())?;
    
    let client_iter = stmt
        .query_map([], |row| {
            Ok(Client {
                id: row.get(0)?,
                name: row.get(1)?,
                tags: serde_json::from_str(&row.get::<_, String>(2)?).unwrap_or_default(),
                contacts: serde_json::from_str(&row.get::<_, String>(3)?).unwrap_or_default(),
                links: serde_json::from_str(&row.get::<_, String>(4)?).unwrap_or_default(),
                next_step: row.get(5)?,
                next_step_due: row.get(6)?,
                created_at: row.get(7)?,
                updated_at: row.get(8)?,
            })
        })
        .map_err(|e| e.to_string())?;
    
    let mut clients = Vec::new();
    for client in client_iter {
        clients.push(client.map_err(|e| e.to_string())?);
    }
    
    Ok(clients)
}

#[tauri::command]
async fn get_projects(db: State<'_, DatabaseConnection>) -> Result<Vec<Project>, String> {
    let conn = db.0.lock().unwrap();
    let mut stmt = conn
        .prepare("SELECT * FROM projects ORDER BY created_at DESC")
        .map_err(|e| e.to_string())?;
    
    let project_iter = stmt
        .query_map([], |row| {
            Ok(Project {
                id: row.get(0)?,
                client_id: row.get(1)?,
                kind: row.get(2)?,
                project_type: row.get(3)?,
                status: row.get(4)?,
                title: row.get(5)?,
                description: row.get(6)?,
                tags: serde_json::from_str(&row.get::<_, String>(7)?).unwrap_or_default(),
                next_step: row.get(8)?,
                next_step_due: row.get(9)?,
                created_at: row.get(10)?,
                updated_at: row.get(11)?,
            })
        })
        .map_err(|e| e.to_string())?;
    
    let mut projects = Vec::new();
    for project in project_iter {
        projects.push(project.map_err(|e| e.to_string())?);
    }
    
    Ok(projects)
}

fn init_schema(conn: &Connection) -> SqliteResult<()> {
    // Create tables
    conn.execute_batch(include_str!("../migrations/001_initial.sql"))?;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            init_database,
            get_tasks,
            create_task,
            get_clients,
            get_projects
        ])
        .setup(|app| {
            // Initialize database on startup
            let app_handle = app.handle();
            tauri::async_runtime::spawn(async move {
                if let Err(e) = init_database(app_handle).await {
                    eprintln!("Failed to initialize database: {}", e);
                }
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

