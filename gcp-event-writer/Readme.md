# GCP Speedtest event writer

## GCP Setup
1. Enable BigQuery API: https://console.cloud.google.com/apis/library/bigquery-json.googleapis.com
1. Create BigQuery dataset named `speedtest`: https://console.cloud.google.com/bigquery
1. Create `speedtest` topic if it doesn't exist: `gcloud pubsub topic create speedtest`

## Deploy
```$bash
 gcloud functions deploy processSpeedtestEvent --trigger-topic speedtest --runtime nodejs8 --region europe-west1
```
