#!/usr/loca/env sh

head -1 201803_fordgobike_tripdata.csv > mini.csv
shuf -n 10000 201803_fordgobike_tripdata.csv >> mini.csv
