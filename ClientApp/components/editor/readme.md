Create template index


PUT 
http://localhost:9200/template
{
  "settings": {
    "analysis": {
      "analyzer": {
        "custom_path_tree": {
          "tokenizer": "custom_hierarchy"
        },
        "custom_path_tree_reversed": {
          "tokenizer": "custom_hierarchy_reversed"
        }
      },
      "tokenizer": {
        "custom_hierarchy": {
          "type": "path_hierarchy",
          "delimiter": "/"
        },
        "custom_hierarchy_reversed": {
          "type": "path_hierarchy",
          "delimiter": "/",
          "reverse": "true"
        }
      }
    }
  },
  "mappings": {
        "properties": {
            "filePath": {
                "type": "text",
                "fields": {
                    "tree": {
                        "type": "text",
                        "analyzer": "custom_path_tree"
                    },
                    "tree_reversed": {
                        "type": "text",
                        "analyzer": "custom_path_tree_reversed"
                    }
                }
            },
            "subType": {
                "type": "keyword"
            },
            "userName": {
              "analyzer": "keyword"
            }
        }
  }
}