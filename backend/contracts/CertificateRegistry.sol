// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateRegistry {
    struct Certificate {
        string operationId;
        string schoolId;
        string certificateId;
        string originalHash;
        string updatedHash;
        uint256 timestamp;
    }
    
    // Mapping from certificateId to Certificate struct
    mapping(string => Certificate) public certificates;
    
    // Array to store all certificate IDs
    string[] public certificateIds;
    
    // Event to log when a certificate is added
    event CertificateAdded(
        string certificateId,
        string operationId,
        string schoolId,
        string originalHash,
        string updatedHash,
        uint256 timestamp
    );
    
    // Function to add a certificate
    function addCertificate(
        string memory operationId,
        string memory schoolId,
        string memory certificateId,
        string memory originalHash,
        string memory updatedHash
    ) public {
        require(bytes(certificates[certificateId].certificateId).length == 0, "Certificate already exists");
        
        certificates[certificateId] = Certificate(
            operationId,
            schoolId,
            certificateId,
            originalHash,
            updatedHash,
            block.timestamp
        );
        
        certificateIds.push(certificateId);
        
        emit CertificateAdded(
            certificateId,
            operationId,
            schoolId,
            originalHash,
            updatedHash,
            block.timestamp
        );
    }
    
    // Function to check if a certificate exists
    function certificateExists(string memory certificateId) public view returns (bool) {
        return bytes(certificates[certificateId].certificateId).length > 0;
    }
    
    // Function to get certificate by ID
    function getCertificate(string memory certificateId) public view returns (
        string memory operationId,
        string memory schoolId,
        string memory certId,
        string memory originalHash,
        string memory updatedHash,
        uint256 timestamp
    ) {
        Certificate memory cert = certificates[certificateId];
        return (
            cert.operationId,
            cert.schoolId,
            cert.certificateId,
            cert.originalHash,
            cert.updatedHash,
            cert.timestamp
        );
    }
    
    // Function to get total number of certificates
    function getTotalCertificates() public view returns (uint256) {
        return certificateIds.length;
    }
} 