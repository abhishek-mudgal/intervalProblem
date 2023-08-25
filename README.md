# Engineering Assignment: Java, Node, Go

This repo contains solution for the problem provided \***\* and \*\*\*** to be completed by **\*\*\***.

## Problem Statement

Write a program that takes two inputs from the command line or a web-service that offers an endpoint taking the following input:

- a set of include intervals
- a set of exclude intervals

The sets of intervals can be given in any order, and they may be empty or overlapping. The program
should output the result of taking all the includes and “remove” the excludes. The output should be given
as non overlapping intervals in a sorted order. The intervals will contain integers only.

#### Example 1:

    Includes: 10-100
    Excludes: 20-30
    Output should be: 10-19, 31-100

#### Example 2:

    Includes: 10-100
    Excludes: 20-30
    Output should be: 10-19, 31-100

#### Example 3:

    Includes: 50-5000, 10-100
    Excludes: (none)
    Output: 10-5000

#### Example 4:

    Includes: 200-300, 50-150
    Excludes: 95-205
    Output: 50-94, 206-300

#### Example 5:

    Includes: 200-300, 10-100, 400-500
    Excludes: 410-420, 95-205, 100-150
    Output: 10-94, 206-300, 400-409, 421-500

<br>

## Solution

Approached the problem by creating a Web Server written in `NodeJS` as a `Lambda` function with the help of `Serverless Framework` which can be deployed on AWS with a single command.

How to start the server locally:

**Downloading the repo**

    git@github.com:abhishek-mudgal/intervalProblem.git && cd intervalProblem

Installing the dependencies and launching the server locally:

    npm i -g serverless
    npm i
    npm run offline

<img width="1144" alt="Screenshot 2023-08-25 at 7 11 42 AM" src="https://github.com/abhishek-mudgal/intervalProblem/assets/25780393/5ad01fdb-5b1d-4a57-9c6a-df6524ddb7f9">

**Once the API serverless offline is up and running, to interact with the lambda function:**

**API Request**

    curl --location 'http://localhost:3000/dev/v1/intervalProblem' \
    --header 'Content-Type: application/json' \
    --data  '{
        "includes": ["200-300", "10-100", "400-500"],
        "excludes": ["410-420", "95-205", "100-150"]
    }'

| Key      | Sample Value                     | Type  |
| -------- | -------------------------------- | ----- |
| excludes | ["410-420", "95-205", "100-150"] | Array |
| includes | ["200-300", "10-100", "400-500"] | Array |
|          |                                  |       |

**Sample Response:**

    {
    "message": "Result Fetched Successfully",
    "data": ["10-94","206-300","400-409","421-500"],
    "status": 200
    }

**Deploying it on the cloud:**
Below command deploys the `Cloudformation` stack on AWS in `ap-south-1` region with the help of Serverless framework. It will also assemble all the necessary resources on the cloud such as Cloudwatch, API Gateway and etc.

    npm run deploy:dev

## Folder Structure

**./serverless.yml**
Configuration file for serverless framework to develop lambda functions and create cloudformation stacks.
**./src/intervalProblem.js**
Lambda function which contains the solution to the problem. Contains the solution to the problem and related helper functions.
**./lib/responses.js**
Contains standard HTTP response functions for API Gateway response, functions also include headers for cors.
