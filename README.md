
# MedXpert REST API Documentation

Welcome to the documentation for the RESTful API of our application. This document provides a comprehensive guide on how to use our API, its endpoints, request and response formats, and authentication methods.

## Table of Contents

1. [Introduction](#introduction)
2. [API Entry Point](#API-Entry-Point)
3. [Authentication](#authentication)
4. [Endpoints](#endpoints)
5. [Request Format](#request-format)
6. [Response Format](#response-format)
7. [MedXpert Book](#medxpert-book)

## Introduction

MedXpert is a medical mobile application that harnesses the power of AI and data analysis. It offers a range of features for patients, including medication management with reminders, the ability to decipher handwritten prescriptions, and access to informative medical articles. Additionally, doctors can utilize the application to track patient progress, monitor vital signs, prescribe medications, and receive alerts when a patient's vital signs deviate from the normal range.

## API-Entry-Point
- http://localhost:5000/api

## Authentication

Authentication is required for most API endpoints. We use JSON Web Tokens (JWT) for authentication. To authenticate, include an `Authorization` header with the `Bearer` token in your requests.

Example:

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

To obtain a JWT token, you will need to make a `POST` request to the `/auth/login` endpoint with your credentials.

## Endpoints

### Auth

- `POST auth/register`: Register a new doctor or patient.
- `POST /login`: Login a doctor or patient.
- `GET /mailVerification`: Verify email address by sending an Email to mailbox.
- `POST /passwordReset/`: Get a password reset link.
- `Get /passwordReset/:token`: Confirm password reset successfully.

### Patients

- `GET /patient/getPatient`: Get details of a specific patient.
- `GET /patient/getAllPatients/`: Get all patients details.
- `PATCH /patient/updatePatient`: Update patient's details.
- `PATCH /patient/addToList/`: Add chronic disease or clinicals to Patient.
- `PATCH /patient/deleteFromList/`: Delete chronic disease or clinicals from Patient.
- `DELETE /patient/deletePatient/`: delete a patient.
- `GET /patient/createInvitation/`: Create an invitation number to be followed.
- `POST /patient/useInvitation/`: Use invitation number to follow another patient.
- `GET /patient/articles/`: Get medical articles to patients or doctors.
- `PATCH /patient/deleteDoctorFromPatient/`: Patients unfollow a doctor.
- `PATCH /patient/deleteFollowerFromPatient/`: Delete a patient follower.
- `PATCH /patient/deleteFollowingFromPatient/`: Patient unfollow another patient.


### Doctors

- `GET /doctor/getDoctor`: Get a details of a specific doctor.
- `GET /doctor/getAllDoctors`: Get all doctors details.
- `PATCH /doctor/updateDoc`: Update doctor's details.
- `DELETE /doctor/deleteDoctor`: Delete a doctor.
- `PATCH /doctor/addSpecialization`: Add a specialization to a doctor.
- `PATCH /doctor/deleteSpecialization`: Delete a specialization from a doctor.
- `POST /doctor/useInvitation`: Doctor Uses invitation number to follow a patient.
- `PATCH /doctor/deletePatientFromDoctor`: unfollow a patient.

### Medications
- `POST /medication/createMedication`: Create a new medication to patient.
- `GET /medication/getMedication`: Get details of a medication.
- `GET /medication/getAllMedications`: Get a All medications.
- `PATCH /medication/updateMedication`: Update certain medication.
- `DELETE /medication/deleteMedication`: delete a medication.
- `PATCH /medication/addMedicationDrug`: Add a drug to a medication.
- `PATCH /medication/deleteMedicationDrug`: Delete a drug from medication.
- `GET /medication/getFollowingMedication`: Get medications of following patients.
- `GET /medication/getMedicationsByPatientId`: Get medications of a patient.
- `PATCH /medication/isDoseTaken`: Update the Dose if it's taken.

### Drugs
- `POST /drug/createDrug`: Create a new drug.
- `GET /drug/getDrug`: Get details of a drug.
- `GET /drug/getAllDrugs`: get details of all drugs.
- `PATCH /drug/updateDrug`: Update drug's details.
- `GET /drug/getDrugNames`: Search for drug names.
- `DELETE /drug/deleteDrug`: Delete a drug.
- `PATCH /drug/addToList`: Add interactions and restrictions with other drugs.
- `PATCH /drug/deleteFromList`: Delete interactions and restrictions with other drugs.
- `GET /drug/autoComplete`: Search autocomplete for drug names.
- `POST /drug/scan`: Scan doctor's prescription to read handwritten drugs.
- `POST /drug/saveToDataset`: Save scanning results as a dataset.

### Drug Reviews
- `POST /review/createReview`: Create a new drug review.
- `GET /vitalSign/getReview`: Get a drug reviews.
- `PATCH /vitalSign/updateReview`: Update a drug review.
- `DELETE /vitalSign/deleteReview`: Delete a drug review.

### Drug Dose Reminders
- `POST /notification/createNotification`: Create a new reminder of drug dose.
- `GET /notification/getNotifications`: Get all reminders of a patient.
- `DELETE /notification/deleteNotification`: Delete a reminder.
- `DELETE /notification/deleteNotificationByDrugUniqueId`: Delete all reminders of a certain drug.

### Measurements
- `POST /vitalSign/createvitalSign`: Create a new measurement for patient.
- `GET /vitalSign/getvitalSignPatient`: Patient get measurements of following patient.
- `GET /vitalSign/getVitalSignDoctor`: Doctor get measurements of his/her patiens.
- `GET /vitalSign/getAllvitalSigns`: Get all measurements.
- `PATCH /vitalSign/updatevitalSign`: update a measurement of a patient.
- `DELETE /vitalSign/deletevitalSign`: Delete a measurement of a patient.


## Request Format

All requests should be made with a JSON payload in the request body, except for `GET` requests that do not require a body.

Example Request:

```json
{
    "name":"aspocid"
}
```

## Response Format

Responses from the API are in JSON format and include a `status` field to indicate success or failure.

Example Success Response:

```json
{
    "message": "success",
    "data": {
       "drugName": "aspocid",
       "price": 10
    }
}
```

Example Error Response:

```json
{
    "statusCode": 400,
    "message": "Invalid input data.",
}
```
## MedXpert Book
For comprehensive details about our project refer to this link to read medXpert Book.
[MedXpert Book](https://drive.google.com/file/d/1G75W2T96UknGCiZFQZlDA47JYTGofOK1/view?usp=sharing)




