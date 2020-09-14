#!/bin/bash

api_url="http://localhost:8080/api"

function post {
    data="$1";shift
    url_postfix="$1";shift

    curl --header "Content-Type: application/json" \
  --request POST \
  --data "$data" \
  "$api_url/$url_postfix"
}

function get {
    url_postfix="$1";shift

    curl "$api_url/$url_postfix"
}

function addStudent {
    data="$1";shift
    post "$data" 'student'
}

function addGroup {
    name="$1";shift
    personIds="$1";shift

    post "{ \"name\": \"$name\", \"personIds\": [$personIds] }" 'group'
}

function getStudentID {
    studentData="$1"
    echo $studentData | grep -o -E \"id\":\"[[:alnum:]]*\" | cut -d'"' -f4
}

mc_data=$(addStudent '{"firstname": "MC", "lastname": "Hammer", "email": "hammer@time.com", "sick": false}')
mc_id=$(getStudentID $mc_data);
sledge_data=$(addStudent '{"firstname": "Sledge", "lastname": "Hammer", "email": "hammering@time.com", "sick": true}')
sledge_id=$(getStudentID $sledge_data);
john_data=$(addStudent '{"firstname": "John", "lastname": "Travolta", "email": "johnny@hollywood.com", "sick": false}')
john_id=$(getStudentID $john_data);
mr_data=$(addStudent '{"firstname": "Mr.", "lastname": "T", "email": "t@team.com", "sick": false}')
mr_id=$(getStudentID $mr_data);
dr_data=$(addStudent '{"firstname": "Dr.", "lastname": "No", "email": "dr@bond.com", "sick": false}')
dr_id=$(getStudentID $dr_data);

echo "show student state"
get 'student'

addGroup "3B-Mathe" "\"${mc_id}\", \"${sledge_id}\""
addGroup "3B-Englisch" "\"${john_id}\", \"${mr_id}\", \"${dr_id}\""

echo "show group state"
get 'group'
