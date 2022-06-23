const { createVitalSign } = require('./createVitalSign')
const { getVitalSignPatient } = require('./getPatientVitalSigns')
const { getVitalSignDoctor } = require('./getDoctorVitalSigns')
const { getAllVitalSigns } = require('./getAllVitalSigns')
const { updateVitalSign } = require('./updateVitalSign')
const { deleteVitalSign } = require('./deleteVitalSign')



// const checkVitalSigns = (vitals) => {

//     const temp_thres_min = 0;
//     const temp_thres_max = 10;

//     const pulse_thres_min = 0;
//     const pulse_thres_max = 0;

//     const respration_thres_min = 0;
//     const respration_thres_max = 0;

//     const pressure_thres_min = 0;
//     const pressure_thres_max = 0;

//     const weight_thres_min = 0;
//     const weight_thres_max = 0;
//     vitals.forEach((vital, _) => {
//         if (vital.temp && (vital.temp > temp_thres_max || vital.temp < temp_thres_min)) {
//             vital.problems.push("temp");
//         }

//         if (vital.pulse && (vital.pulse > pulse_thres_max || vital.pulse < pulse_thres_min)) {
//             vital.problems.push("pulse");
//         }

//         if (vital.respration && (vital.respration > respration_thres_max || vital.respration < respration_thres_min)) {
//             vital.problems.push("respration");
//         }

//         if (vital.pressure && (vital.pressure > pressure_thres_max || vital.pressure < pressure_thres_min)) {
//             vital.problems.push("pressure");
//         }

//         if (vital.weight && (vital.weight > weight_thres_max || vital.weight < weight_thres_min)) {
//             vital.problems.push("weight");
//         }
//     })
// }

module.exports = {
    createVitalSign,
    getVitalSignDoctor,
    getVitalSignPatient,
    getAllVitalSigns,
    updateVitalSign,
    deleteVitalSign
}