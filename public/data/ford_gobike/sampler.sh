#!/usr/bin/env sh

head -1 201803_fordgobike_tripdata.csv \
  | cut -d',' -f 1-4,8,12-15 \
  > mini.csv

cat 201803_fordgobike_tripdata.csv \
  | cut -d',' -f 1-4,8,12-15 \
  | gshuf -n 10000 \
  >> mini.csv

# clean up
sed -i '' -e 's/\"Male\"$/0/' mini.csv
sed -i '' -e 's/\"Female\"$/1/' mini.csv
sed -i '' -e 's/\"Other\"$/2/' mini.csv
sed -i '' -e 's/\"\"$/-1/' mini.csv

sed -i '' -e 's/\"Subscriber\"/0/' mini.csv
sed -i '' -e 's/\"Customer\"/1/' mini.csv

