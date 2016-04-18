
zingchart.THEME="classic";
BAS_URL = 'http://localhost';

    
    /*
    Graph rendring functions
    */
    function renderLoadGraph(data, max) {

          var config = {
              "background-color": "#F2F2F0",
              "type": "area",
              "title": {
                  "text": "System Load",
                  "text-align": "center",
                  "font-color": "#5b5b5b",
                  "font-size": "18px",
                  "padding": "10px",
                  "background-color": "none"
              },
              "plotarea": {
                  "margin": "15% 10% 20% 15%"
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
            height: 500, 
            width: '100%' 
          });        
    }



   /*
   Data loading functions
   */ 
   function fetchLoadData() {

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


          $.post(BAS_URL + '/data/elastic_controller.php', {query: JSON.stringify(load_data_query)}, function(response) {
        
                var buckets = response.aggregations['2'].buckets;
                var dataSet = [];
                var dataMax = 0;

                for(var i=0; i<buckets.length; i++) {
                    dataSet[i] = buckets[i]['3'].buckets['0']['1'].value;
                    if( dataMax < dataSet[i])
                      dataMax = dataSet[i];
                }

                renderLoadGraph(dataSet, dataMax);

          },'JSON');      

   }

   function fetchCpuData() {

            var cpu_data_query = {
                      "size": 0,
                      "aggs": {
                        "9": {
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
                                "field": "cpu.user_p"
                              }
                            },
                            "3": {
                              "avg": {
                                "field": "cpu.system_p"
                              }
                            },
                            "4": {
                              "max": {
                                "field": "mem.total"
                              }
                            },
                            "5": {
                              "max": {
                                "field": "mem.used"
                              }
                            },
                            "6": {
                              "max": {
                                "field": "mem.free"
                              }
                            },
                            "8": {
                              "max": {
                                "field": "mem.used_p"
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
                                      "gte": 'now-15m',
                                      "lte": 'now',
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


          $.post(BAS_URL + '/data/elastic_controller.php', {query: JSON.stringify(cpu_data_query)}, function(response) {
                
                  var buckets = response.aggregations['9'].buckets['0'];
                  $('#cpuData').html('<tr><td>' + Math.round(buckets['1'].value*100000)/1000 + '% </td><td>' + Math.round(buckets['3'].value*100000)/1000 + '% </td><td>' + Math.round(buckets['4'].value/1024000)/1000 + ' GB </td><td>' + Math.round(buckets['5'].value/1024000)/1000 + ' GB </td><td>' + Math.round(buckets['8'].value*100000)/1000 + '% </td><td>' + Math.round(buckets['6'].value/1024000)/1000 + ' GB </tr>');

          },'JSON');
   }

   function fetchProcessData() {

        var process_data_query = {
              "size": 0,
              "aggs": {
                "6": {
                  "terms": {
                    "field": "proc.name",
                    "size": 10,
                    "order": {
                      "1": "desc"
                    }
                  },
                  "aggs": {
                    "1": {
                      "max": {
                        "field": "proc.cpu.user_p"
                      }
                    },
                    "2": {
                      "max": {
                        "field": "proc.mem.rss"
                      }
                    },
                    "3": {
                      "max": {
                        "field": "proc.mem.rss_p"
                      }
                    },
                    "5": {
                      "max": {
                        "field": "proc.mem.share"
                      }
                    }
                  }
                }
              },
              "query": {
                "filtered": {
                  "query": {
                    "query_string": {
                      "query": "type: process",
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
                              "gte": 'now-15m',
                              "lte": 'now',
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

        $.post(BAS_URL + '/data/elastic_controller.php', {query: JSON.stringify(process_data_query)}, function(response) {
                
                console.log(response);
                var buckets = response.aggregations['6'].buckets;

                $('#processData').empty();

                for(var i=0; i<buckets.length; i++) {
                    
                    $('#processData').append(
                      '<tr>' +
                        '<td>' + buckets[i].key + '</td>' +
                        '<td>' + Math.round( buckets[i]['1'].value*100000)/1000 + '% </td>' +
                        '<td>' + Math.round( buckets[i]['2'].value/1024000)/1000 + ' GB </td>' +
                        '<td>' + Math.round( buckets[i]['3'].value*100000)/1000 + '% </td>' +
                        '<td>' + Math.round( buckets[i]['5'].value/1024000)/1000 + ' GB </td>' +
                      '</tr>'
                      );

                }  


        },'JSON');    
   }

   /*
   Master function to load all data
   */
   function loadData() {

      fetchLoadData();
      fetchCpuData();
      fetchProcessData();
   }


  $(function(){

        loadData();
        setInterval(loadData, 15000);
        

  });