# coding: utf-8
# Module: methods
# Created on: 02.07.2015
# Author: Roman Miroshnychenko aka Roman V.M. (romanvm@yandex.ua)
# Licence: GPL v.3: http://www.gnu.org/copyleft/gpl.html
"""
JSON-RPC methods implementation

The methods are called via POST request at this address.
Don't forget to add ('Content-Type': 'application/json') header to your http-request.
The API is compliant with JSON-RPC 2.0, though 'jsonrpc' and 'id' keys are optional in requests.
Example:
{"method": "pause_torrent", "params": {"info_hash":"21df87c3cc3209e3b6011a88053aec35a58582a9"}}

"params" is an object (dict) containing of method call parameters. Some methods do not take any parameters.
For those methods "params" key can be equal null or omitted.
"""


def ping(torrent_client, params=None):
    """
    Connection test method

    :return: 'pong'
    """
    return 'pong'


def add_torrent(torrent_client, params):
    """
    Add torrent method

    The method calls add_torrent_async() in a separate thread
    and returns immediately. Then you need to poll torrent added status
    using check_torrent_added method.
    params['torrent'] - str - magnet link or torrent URL
    params['save_path'] - str - save path (optional).
        If save path is missing or equals an empty string then the default save path is used.
    params['zero_priorities'] - bool - zero priorities (do not start download immediately, optional, default - True)
    :return: 'OK'
    """
    torrent_client.add_torrent_async(params['torrent'], params['save_path'], params['zero_priorities'])
    return 'OK'


def check_torrent_added(torrent_client, params=None):
    """
    Check torrent_added flag

    params - None
    :return: bool - torrent added or not
    """
    return torrent_client.is_torrent_added


def get_last_added_torrent(torrent_client, params=None):
    """
    Get added torrent info

    params - None
    :return: dict - added torrent info
    """
    return torrent_client.last_added_torrent


def get_torrent_info(torrent_client, params):
    """
    Get torrent info

    params['info_hash'] - str - info_hash in lowercase
    :return: dict - extended torrent info
    """
    return torrent_client.get_torrent_info(params['info_hash'])


def get_all_torrent_info(torrent_client, params=None):
    """
    Get info for all torrents in the session

    Note: The torrents are listed in random order,
    it us up to a client to sort the list accordingly.
    :return: list - the list of torrent info dicts
    """
    return torrent_client.get_all_torrents_info()


def pause_torrent(torrent_client, params):
    """
    Pause torrent

    params['info_hash'] - torrent info-hash in lowercase
    :return: 'OK'
    """
    torrent_client.pause_torrent(params['info_hash'])
    return 'OK'


def pause_group(torrent_client, params):
    """
    Pause several torrents

    params['info_hashes'] - the list of info-hashes in lowercase
    :return: 'OK'
    """
    for info_hash in params['info_hashes']:
        torrent_client.pause_torrent(info_hash)
    return 'OK'


def resume_torrent(torrent_client, params):
    """
    Resume torrent

    params['info_hash'] - torrent info-hash in lowercase
    :return: 'OK'
    """
    torrent_client.resume_torrent(params['info_hash'])
    return 'OK'


def resume_group(torrent_client, params):
    """
    Resume several torrents

    params['info_hashes'] - the list of info-hashes in lowercase
    :return:
    """
    for info_hash in params['info_hashes']:
        torrent_client.resume_torrent(info_hash)
    return 'OK'


def remove_torrent(torrent_client, params):
    """
    Remove torrent

    params['info_hash'] - info-hash
    params['delete_files'] - bool - also remove files
    :return: 'OK'
    """
    torrent_client.remove_torrent(params['info_hash'], params['delete_files'])
    return 'OK'


def remove_group(torrent_client, params):
    """

    params['info_hashes'] - the list of info-hashes
    params['delete_files'] - bool - also remvove files
    :return:
    """
    for info_hash in params['info_hashes']:
        torrent_client.remove_torrent(info_hash, params['delete_files'])
    return 'OK'


def buffer_torrent(torrent_client, params):
    """
    Stream torrent

    params['info_hash'] - torrent info-hash in lowercase
    params['file_index'] - the index of the file to be buffered
    params['buffer_size'] - buffer size in MB
    :return: 'OK'
    """
    torrent_client.buffer_torrent_async(params['info_hash'], params['file_index'], params['buffer_size'])
    return 'OK'


def check_buffering_complete(torrent_client, params=None):
    """
    Check if buffering is complete

    :return: bool - buffering status
    """
    return torrent_client.is_buffering_complete


def abort_buffering(torrent_client, params=None):
    """
    Abort buffering

    :return: 'OK'
    """
    torrent_client.abort_buffering()
    return 'OK'


def pause_all(torrent_client, params=None):
    """
    Pause all torrents

    :return: 'OK'
    """
    torrent_client.pause_all()
    return 'OK'


def resume_all(torrent_client, params=None):
    """
    Resume all torrents

    :return: 'OK'
    """
    torrent_client.resume_all()
    return 'OK'


def get_buffer_percent(torrent_client, params=None):
    """
    Get buffer %

    :return: int - buffer % (can be more than 100%).
    """
    return torrent_client.buffer_percent
