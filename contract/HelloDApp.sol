// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

contract HelloDApp {
    event Updatedmessage(string oldString, string newString);

    string public message;

    constructor(string memory _msg) {
        message = _msg;
    }

    function readMesage() public view returns (string memory) {
        return message;
    }

    function updateMessage(string memory _newMsg) public {
        string memory oldStr = message;
        message = _newMsg;

        emit Updatedmessage(oldStr, _newMsg);
    }
}
