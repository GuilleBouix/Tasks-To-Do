from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify, render_template_string
import sqlite3
from functools import wraps
import hashlib
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'todoappbyguillermobouix'



# Conexion a la base de datos
def conectarDatabase():
    """
    Establece una conexión con la base de datos SQLite y configura el 
    `row_factory` para que los resultados de las consultas se devuelvan 
    como diccionarios en lugar de tuplas.

    Returns:
        conexion: Un objeto de conexión a la base de datos SQLite.
    """
    # Establece la conexión con la base de datos
    conexion = sqlite3.connect('database.db')

    # Configura la conexión para que los resultados se devuelvan como diccionarios
    conexion.row_factory = sqlite3.Row

    return conexion



# Decorador que verifica si hay o no una sesión activa
def login_required(f):  # Define el decorador login_required, que toma una función f como argumento
    @wraps(f)  # Aplica el decorador wraps para preservar metadatos de la función original f
    def decorated_function(*args, **kwargs):  # Define la función envuelta que reemplazará a f
        if 'user_id' not in session:  # Verifica si 'user_id' no está en la sesión (es decir, si no hay sesión activa)
            return redirect(url_for('ingreso'))  # Redirige al usuario a la página de inicio de sesión
        return f(*args, **kwargs)  # Si la sesión está activa, llama a la función original f con los argumentos proporcionados
    return decorated_function  # Devuelve la función envuelta que reemplaza a la función original



# Ruta de Base
@app.route('/')
def index():
    # Verificar si hay una sesión activa
    if 'user_id' not in session:
        # Si no hay sesión, redirigir al login
        return redirect(url_for('ingreso'))

    # Si hay sesión activa, renderizar la página del dashboard
    return render_template('base.html')





# Ruta de Registro
@app.route('/registro', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST':
        # Lógica para manejar el registro
        apellido = request.form['apellido']
        nombre = request.form['nombre']
        email = request.form['signup-email']
        password = generate_password_hash(request.form['signup-contrasena'])

        conexion = conectarDatabase()
        cursor = conexion.cursor()
        
        # Guardar usuario en la base de datos
        cursor.execute("INSERT INTO usuarios (apellido, nombre, email, contrasena) VALUES (?, ?, ?, ?)", 
                       (apellido, nombre, email, password))
        conexion.commit()
        conexion.close()

        return redirect(url_for('ingreso'))
    
    return render_template('signup.html')



# Ruta de Ingreso
@app.route('/ingreso', methods=['GET', 'POST'])
def ingreso():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        conexion = conectarDatabase()
        cursor = conexion.cursor()

        # Verificar si el usuario existe
        cursor.execute("SELECT id_usuario, email, contrasena FROM usuarios WHERE email = ?", (email,))
        usuario = cursor.fetchone()

        if usuario and check_password_hash(usuario[2], password):
            # Crear sesión para el usuario
            session['user_id'] = usuario[0]
            return redirect(url_for('total_tareas'))
        else:
            flash('Correo o contraseña incorrectos.', 'danger')
    
    return render_template('login.html')



# Ruta del Buscador
@app.route('/buscador', methods=['GET'])
@login_required
def buscador():
    # Obtener la consulta del usuario desde los parámetros de la URL
    query = request.args.get('query', '')

    # Conectar a la base de datos usando tu función
    conexion = conectarDatabase()
    cursor = conexion.cursor()

    # Consulta SQL para buscar en la tabla "tareas" por el campo "descripcion"
    cursor.execute("""
        SELECT id_tarea, descripcion, fecha_creacion, estado 
        FROM tareas 
        WHERE descripcion LIKE ?
    """, (f'%{query}%',))

    # Obtener los resultados de la consulta
    tareas = cursor.fetchall()
    conexion.close()

    # Preparar los resultados para enviarlos al template
    resultados = [{
        'id_tarea': tarea['id_tarea'],
        'descripcion': tarea['descripcion'],
        'fecha_creacion': tarea['fecha_creacion'],
        'estado': tarea['estado']
    } for tarea in tareas]

    # Renderizar el template buscador.html con los resultados de la búsqueda
    return render_template('buscador.html', tareas=resultados)




# Ruta Total de Tareas
@app.route('/total_tareas', methods=['GET', 'POST'])
@login_required
def total_tareas():
    if request.method == 'POST':
        descripcion = request.form['tarea']  # Obtiene la descripción de la tarea desde el formulario
        if descripcion:  # Verifica que la descripción no esté vacía
            id_usuario = session['user_id']  # Obtiene el ID del usuario desde la sesión
            fecha = datetime.now()
            fecha_creacion = str(fecha) # Obtiene la fecha y hora actuales

            conexion = conectarDatabase()
            cursor = conexion.cursor()

            # Inserta la nueva tarea en la base de datos
            cursor.execute("INSERT INTO tareas (id_usuario, descripcion, fecha_creacion) VALUES (?, ?, ?)",
                           (id_usuario, descripcion, fecha_creacion))
            conexion.commit()
            conexion.close()
        return redirect(url_for('total_tareas'))

    # Si la solicitud es GET, obtenemos las tareas del usuario y las mostramos
    conexion = conectarDatabase()
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM tareas WHERE id_usuario = ?", (session['user_id'],))
    tareas = cursor.fetchall()
    conexion.close()

    return render_template('total_tareas.html', tareas=tareas)



# Ruta Tareas Pendientes
@app.route('/tareas_pendientes')
@login_required
def tareas_pendientes():
    conn = conectarDatabase()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tareas WHERE id_usuario = ?", (session['user_id'],))
    tareas = cursor.fetchall()
    conn.close()
    return render_template('tareas_pendientes.html', tareas=tareas)



# Ruta Tareas Completadas
@app.route('/tareas_completadas')
@login_required
def tareas_completadas():
    conn = conectarDatabase()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tareas WHERE id_usuario = ?", (session['user_id'],))
    tareas = cursor.fetchall()
    conn.close()
    return render_template('tareas_completadas.html', tareas=tareas)



# Ruta Agregar Tarea
@app.route('/agregar_tarea', methods=['POST'])
@login_required
def agregar_tarea():
    descripcion = request.form.get('descripcion')
    id_usuario = session.get('user_id')
    fecha_creacion = datetime.now().strftime('%d/%m/%Y  -  %H:%M')
    estado = 0

    conexion = conectarDatabase()
    cursor = conexion.cursor()
    
    # Verificar la cantidad de tareas del usuario
    cursor.execute("SELECT COUNT(*) FROM tareas WHERE id_usuario = ?", (id_usuario,))
    cantidad_tareas = cursor.fetchone()[0]

    # Comprobar si el usuario ya tiene 10 tareas
    if cantidad_tareas >= 10:
        conexion.close()
        # Mostrar un alert en el navegador
        return render_template_string("""
            <script>
                alert('Has alcanzado el límite máximo de 10 tareas. Elimina una tarea para agregar una nueva.');
                window.location.href = "{{ url_for('total_tareas') }}";
            </script>
        """)
    
    cursor.execute(
        "INSERT INTO tareas (id_usuario, descripcion, fecha_creacion, estado) VALUES (?, ?, ?, ?)",
        (id_usuario, descripcion, fecha_creacion, estado)
    )
    conexion.commit()
    conexion.close()

    return redirect(url_for('total_tareas'))



# Ruta Eliminar Tarea
@app.route('/eliminar_tarea/<int:id_tarea>', methods=['POST'])
@login_required
def eliminar_tarea(id_tarea):
    conexion = conectarDatabase()
    cursor = conexion.cursor()
    cursor.execute("DELETE FROM tareas WHERE id_tarea = ?", (id_tarea,))
    conexion.commit()
    conexion.close()

    return redirect(url_for('total_tareas'))



# Ruta Actualizar Estado de la Tarea
@app.route('/actualizar_estado/<int:id_tarea>', methods=['POST'])
@login_required
def actualizar_estado(id_tarea):
    data = request.get_json()
    completada = data.get('completada', 0)

    conexion = conectarDatabase()
    cursor = conexion.cursor()
    cursor.execute("UPDATE tareas SET estado = ? WHERE id_tarea = ?", (completada, id_tarea))
    conexion.commit()
    conexion.close()

    return jsonify(success=True)



# Ruta Logout
@app.route('/cerrar_sesion')
@login_required
def cerrar_sesion():
    # Elimina todos los datos de la sesión
    session.clear()
    # Redirige al login
    return redirect(url_for('ingreso'))



# Ejecutar Programa en el puerto 5000 (Modo debug)
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)