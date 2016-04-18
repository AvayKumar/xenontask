zingchart.THEME="classic";


  function loadLoadGraph(data, max) {

        var config = {
            "background-color": "#f5f8f4",
            "type": "area",
            "plotarea": {
                "margin": "15% 10% 30% 15%"
            },
            "scale-x": {
                "values": [],
                "label": {
                    "text": "@timestamp per 30 seconds",
                    "font-color": "#5b5b5b"
                },
                "line-style": "solid",
                "line-width": "1px",
                "line-color": "#5b5b5b",
                "guide": {
                    "line-style": "solid",
                    "line-width": "1px",
                    "line-color": "#5b5b5b"
                },
                "tick": {
                    "line-style": "solid",
                    "line-width": "1px",
                    "line-color": "#5b5b5b"
                }
            },
            "scale-y": {
                "min-value": 0.0,
                "max-value": Math.ceil( max ),
                "step": 0.5,
                "format": "%v",
                "label": {
                    "text": "Average load.load1",
                    "font-color": "#5b5b5b"
                },
                "line-style": "solid",
                "line-width": "1px",
                "line-color": "#5b5b5b",
                "guide": {
                    "line-style": "solid",
                    "line-width": "1px",
                    "line-color": "#5b5b5b"
                },
                "tick": {
                    "line-style": "solid",
                    "line-width": "1px",
                    "line-color": "#5b5b5b"
                }
            },
            "plot": {
                "stacked": true,
                "stack-type": "0%",
                "active-area": true
            },
            "tooltip": {
                "text": "load.load1: %v",
                "decimals": 3,
                "shadow": 0,
                "border-radius": 5
            },
            "series": [
                {
                    "values": data,
                    "text": "Poor",
                    "line-color": "#67b3b4",
                    "marker": {
                        "background-color": "#93c2b7",
                        "border-color": "#67b3b4",
                        "border-width": "2px",
                        "shadow": false
                    },
                    "background-color": "#93c2b7"
                }
            ]
        };

        zingchart.render({ 
          id : 'loadChart', 
          data : config, 
          height: 700, 
          width: '100%' 
        });        
  }

  $(function(){

    var BAS_URL = 'http://localhost';

    var load_data_query = {
      "size": 0,
      "aggs": {
        "2": {
          "date_histogram": {
            "field": "@timestamp",
            "interval": "30s",
            "time_zone": "Asia/Kolkata",
            "min_doc_count": 1,
            "extended_bounds": {
              "min": "now-15m",
              "max": "now"
            }
          },
          "aggs": {
            "3": {
              "terms": {
                "field": "beat.name",
                "size": 5,
                "order": {
                  "1": "desc"
                }
              },
              "aggs": {
                "1": {
                  "avg": {
                    "field": "load.load1"
                  }
                }
              }
            }
          }
        }
      },
      "query": {
        "filtered": {
          "query": {
            "query_string": {
              "query": "type: system",
              "analyze_wildcard": true
            }
          },
          "filter": {
            "bool": {
              "must": [
                {
                  "query": {
                    "query_string": {
                      "analyze_wildcard": true,
                      "query": "*"
                    }
                  }
                },
                {
                  "range": {
                    "@timestamp": {
                      "gte": "now-15m",
                      "lte": "now",
                      "format": "epoch_millis"
                    }
                  }
                }
              ],
              "must_not": []
            }
          }
        }
      }
    };

    $.post(BAS_URL + '/data/elastic_controller.php', {query: JSON.stringify(load_data_query)}, function(response){
        
        var buckets = response.aggregations['2'].buckets;
        var dataSet = [];
        var dataMax = 0;

        for(var i=0; i<buckets.length; i++) {
            dataSet[i] = buckets[i]['3'].buckets['0']['1'].value;
            if( dataMax < dataSet[i])
              dataMax = dataSet[i];
        }

        loadLoadGraph(dataSet, dataMax);

        console.log(dataSet);
        console.log(dataMax);  

    },'JSON');    

  });