# logging_config.py
import logging
import logging.config

LOGGING_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'standard': {
            'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',  
            'class': 'logging.FileHandler',
            'filename': 'app.log',
            'formatter': 'standard',
        },
        'console': {
            'level': 'INFO', 
            'class': 'logging.StreamHandler',
            'formatter': 'standard',
        },
    },
    'loggers': {
        '': {  
            'handlers': ['file', 'console'],
            'level': 'INFO',  
            'propagate': True,
        },
    }
}

def setup_logging():
    logging.config.dictConfig(LOGGING_CONFIG)