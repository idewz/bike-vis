#!/usr/bin/env sh

script_name=$(basename "$0")

if [[ $# != 2 ]]; then
    echo "Usage: $script_name INFILE OUTFILE [shuffle]" 
      exit
    fi

input_file=$1
output_file=$2
shuffle={$3:-true}

if [ $shuffle = true ] ;
then
  # cut the head
  head -1 $input_file \
    | cut -d',' -f 1-4,8,12-15 \
    > $output_file

  echo "shuffling to $output_file"
  cat $input_file \
    | cut -d',' -f 1-4,8,12-15 \
    | gshuf -n 10000 \
    >> $output_file
else

  echo "copying to $output_file"
  cat $input_file \
    | cut -d',' -f 1-4,8,12-15 \
    > $output_file
fi

echo "cleaning up fields"
sed -i '' -e 's/\"Male\"/0/' $output_file
sed -i '' -e 's/\"Female\"/1/' $output_file
sed -i '' -e 's/\"Other\"/2/' $output_file
sed -i '' -e 's/\"\"$/-1/' $output_file

sed -i '' -e 's/\"Subscriber\"/0/' $output_file
sed -i '' -e 's/\"Customer\"/1/' $output_file
sed -i '' -e 's/\"//g' $output_file

