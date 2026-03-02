import { describe, test, expect, beforeEach } from 'vitest';
import { Turno, Especialidades, GrupoSanguineo, MedicoAtributos, PacienteAtributos, Persona, Medico, Paciente } from '../../src/ejercicios-PE102/ejercicio-1-PE102'

describe ('PRUEBAS DE LAS CLASES PERSONA, MEDICO, PACIENTE Y HOSPITAL',() => {
    let newPaciente: Paciente;
    let newMedico: Medico;
    beforeEach(() => {
        newPaciente = new Paciente('42434378G', 'Juan Jose Morales', new Date('2001-01-28'), 608909090, 'hola@.es', 333, GrupoSanguineo.A, []);
        newMedico = new Medico('42434378F', 'Maria Jose Hernandez', new Date('2000-01-28'), 608907770, 'gola@.com', 222, Especialidades.CIRUJANO, 'mañana');
    });

    describe ('PRUEBAS DE PACIENTE',() => {
        test('Atributos:', ()=> {
            expect(newPaciente.dni).toBe('42434378G');
            expect(newPaciente.alergias.length).toBe(0);
            expect(() => newPaciente.getResume().includes('Juan Jose Morales'));
            expect(newPaciente.numHistorialClinico).toBe(333);
            expect(newPaciente.numTelefono).toBe(608909090);
            expect(newPaciente.grupoSanguineo).toBe(GrupoSanguineo.A);
        });

        test('Setters:', ()=> {
            expect(newPaciente.dni = '33333333T').toBe('33333333T');
            expect(newPaciente.nombre = 'PEPE').toBe('PEPE');
            expect(newPaciente.numTelefono = 666666666).toBe(666666666);
            expect(newPaciente.correo = 'holallaalal').toBe('hola@.es')
        });
    });
    describe ('PRUEBAS DE MEDICO',() => {
        test('Atributos:', ()=> {
            expect(newMedico.dni).toBe('42434378F');
            expect(newMedico.turno).toBe('mañana');
            expect(() => newMedico.getResume().includes('Maria Jose Hernandez'));
            expect(newMedico.numColegiado).toBe(222);
            expect(newMedico.numTelefono).toBe(608907770);
            expect(newMedico.fechaNacimiento.getFullYear()).toBe(2000);
        }) 
    });


});

// describe ('',() => {

// });
// describe ('',() => {

// });
// describe ('',() => {

// }); 
test('', ()=> {
            
        })