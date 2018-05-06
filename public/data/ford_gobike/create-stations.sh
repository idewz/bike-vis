LIST=$(cat $1 | cut -d',' -f 4-7 && \
  cat $1 | cut -d',' -f 8-11)

echo '"id","name","latitude","longitude"' > stations.csv
echo "${LIST}" | sed -e 's/\"//g' | sort -nk1 | uniq | sed '1,2d' >> stations.csv
