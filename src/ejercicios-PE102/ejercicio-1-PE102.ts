export type Turno = "mañana" | "tarde" | "noche";

export type CitasMedicas = [Medico, Paciente, Date];

export enum Especialidades {
    DERMATOLOGO = 'DERMATOLOGO',
    CIRUJANO = 'CIRUJANO',
    NEUROLOGO = 'NEUROLOGO',
    PEDIATRA = 'PEDIATRA'
}

export enum GrupoSanguineo {
    A = 'A',
    B = 'B',
    NegO = 'NegO',
    PosO = 'PosO'
}

export interface MedicoAtributos {
    numColegiado: number;
    especialidad: Especialidades;
    turno: Turno;
}

export interface PacienteAtributos {
    numHistorialClinico: number;
    grupoSanguineo: GrupoSanguineo;
    alergias: string[];
}

export abstract class Persona {
    constructor(protected _dni: string,
                protected _nombre: string,
                protected _fechaNacimiento: Date,
                protected _numTelefono: number,
                protected _correo: string
    ) {}

    abstract get dni(): string;
    abstract get nombre(): string;
    abstract get numTelefono(): number;
    abstract get fechaNacimiento(): Date; 
    abstract get correo(): string

    abstract set dni(dni_: string);
    abstract set nombre(nombre_: string);
    abstract set numTelefono(numTelefono_: number);
    abstract set fechaNacimiento(fecha_: Date);
    abstract set correo(correo_: string);


    abstract getResume(): string;
}

export class Medico extends Persona implements MedicoAtributos{
    constructor(protected _dni: string,
                protected _nombre: string,
                protected _fechaNacimiento: Date,
                protected _numTelefono: number,
                protected _correo: string,
                public numColegiado: number,
                public especialidad: Especialidades,
                public turno: Turno
    ) {
        super(_dni, _nombre, _fechaNacimiento, _numTelefono, _correo);
    }

    get dni(): string {
        return this._dni;
    }

    get nombre(): string {
        return this._nombre;
    }

    get fechaNacimiento(): Date {
        return this._fechaNacimiento;
    }

    get numTelefono(): number {
        
        return this._numTelefono;
    }

    get correo(): string {
        return this._correo;
    }

    set dni(dni_: string) {
        const dniFormato = "[0-9][0-9][0-9][0-9]"
        const dni_regex = new RegExp(`^(${dniFormato})(${dniFormato})[A-Z]$`)
        if (dni_regex.test(dni_)) {
            this._dni = dni_;
        }
    }

    set nombre(nombre_: string) {
        this._nombre = nombre_;
    }

    set fechaNacimiento(fecha_: Date) {
        this._fechaNacimiento = fecha_;
    }

    set numTelefono(numTelefono_: number){
        const telefono = "[0-9][0-9][0-9]";
        const telefono_regex = new RegExp(`^(${telefono})(${telefono})(${telefono})$`);
        if (telefono_regex.test(String(numTelefono_))) {
            this._numTelefono = numTelefono_;
        }
    }

    set correo(correo_: string){
        const correo_regex = new RegExp(`^*@.*$`);
        if (correo_regex.test(correo_)) {
            this._correo = correo_;
        }
    }

    getResume(): string {
        return `Dni: ${this.dni}, Nombre de paciente: ${this.nombre}` +
                `fecha de nacimiento: ${this.fechaNacimiento.getDate}, numero telefonico: ` +
                `${this.numTelefono}, numero de colegiado: ${this.numColegiado}, `+
                `especialidad médica: ${this.especialidad}, turno: ${this.turno}`;
    }

}

export class Paciente extends Persona implements PacienteAtributos {
    constructor(protected _dni: string,
                protected _nombre: string,
                protected _fechaNacimiento: Date,
                protected _numTelefono: number,
                protected _correo: string,
                public numHistorialClinico: number,
                public grupoSanguineo: GrupoSanguineo,
                public alergias: string[]

    ) {
        super(_dni, _nombre, _fechaNacimiento, _numTelefono, _correo);
    }

    get dni(): string {
        return this._dni;
    }

    get nombre(): string {
        return this._nombre;
    }

    get fechaNacimiento(): Date {
        return this._fechaNacimiento;
    }

    get numTelefono(): number {
        return this._numTelefono;
    }

    get correo(): string {
        return this._correo;
    }   

    set dni(dni_: string) {
        const dniFormato = "[0-9][0-9][0-9][0-9]"
        const dni_regex = new RegExp(`^(${dniFormato})(${dniFormato})[A-Z]$`)
        if (dni_regex.test(dni_)) {
            this._dni = dni_;
        }
    }

    set nombre(nombre_: string) {
        this._nombre = nombre_;
    }

    set fechaNacimiento(fecha_: Date) {
        this._fechaNacimiento = fecha_;
    }

    set numTelefono(numTelefono_: number){
        const telefono = "[0-9][0-9][0-9]";
        const telefono_regex = new RegExp(`^(${telefono})(${telefono})(${telefono})$`);
        if (telefono_regex.test(String(numTelefono_))) {
            this._numTelefono = numTelefono_;
        }
    }

    set correo(correo_: string){
        const correo_regex = new RegExp(`[a-z]*@.*$`);
        if (correo_regex.test(correo_)) {
            this._correo = correo_;
        }
    }

    getResume(): string {
        return `Dni: ${this.dni}, Nombre de paciente: ${this.nombre}` +
                `fecha de nacimiento: ${this.fechaNacimiento.getDate}, numero telefonico: ` +
                `${this.numTelefono}, numero de historial clínico: ${this.numHistorialClinico}, `+
                `grupo sanguineo: ${this.grupoSanguineo}, alergias: ${this.alergias}`;
    }
}

export class Hospital {
    protected citasMedicas: CitasMedicas[] = [];
    constructor(public medicos: Medico[],
                public pacientes: Paciente[],
                public numMaxCitas: number
    ) {}

    nuevaCitaMedica(medico: Medico, paciente: Paciente, fecha: Date): string | void {
        if (!this.pacientes.some(p => p === paciente)) {
            return 'Paciente introducido no figura como dado de alta en el sistema';
        }
        if (!this.medicos.some(m => m === medico)) {
            return 'Médico introducido no figura como dado de alta en el sistema';
        }
        if (this.contarCitas(medico) >= this.numMaxCitas) {
            return "Medico sin disponibilidad";
        }

        this.citasMedicas.push([medico, paciente, fecha]);
    }

    contarCitas(medico: Medico) {
        return this.citasMedicas.filter(c => c[0] === medico).length;
    }

    mostrarPacientes() {
        console.table(this.pacientes);
    }

    mostrarMedicos() {
        console.table(this.medicos);
    }

    /**
     * Método que busca paciente o médico dado un dni
     * @param objetivo - Lo que se quiere buscar (paciente o médico)
     * @param dni_ - Por lo que se busca
     * @returns Retorna el médico o paciente que se queria encontrar
     */
    busqueda(objetivo: "medico" | "paciente" ,dni_: string) {
        if (objetivo === 'medico') {
            return this.busquedaMedico(dni_);
        }
        return this.busquedaPaciente(dni_);
    }

    /**
     * Metodo que busca a un médico dado un dni
     * @param dni_ - Dni por el cual buscar al médico 
     * @returns Retorna el médico o en caso de no encontrarlo 0.
     */
    busquedaMedico(dni_: string): Medico | 0 {
        this.medicos.forEach(m => {
            if (m.dni === dni_) return m;
        });
        return 0;
    }
    /**
     * Metodo que busca a un paciente dado un dni
     * @param dni_ - Dni por el cual buscar al paciente 
     * @returns Retorna el paciente o en caso de no encontrarlo 0.
     */
    busquedaPaciente(dni_: string): Medico | 0 {
        this.pacientes.forEach(p => {
            if (p.dni === dni_) return p;
        });
        return 0;
    }

    filtroMedicos(key: Turno | Especialidades) {
        if (key === 'mañana' || key === 'tarde' || key === 'noche') {
            return this.medicos.filter(m => m.turno === key);
        }
        return this.medicos.filter(m => m.especialidad === key);
    }

    citasEnEstaFecha(fecha: Date) {
        return this.citasMedicas.filter(c => c[2] === fecha);
    }
}

     

  //Validamos que el IP tenga una estructura correcta
