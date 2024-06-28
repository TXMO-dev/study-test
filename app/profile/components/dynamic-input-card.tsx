'use client'

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardBody,
  Input,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

interface InputData {
  label: string;
  data: string;
}

const DynamicInputCard: React.FC = () => {
  const [inputData, setInputData] = useState<InputData>({ label: '', data: '' });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <Card>
      <CardBody>
        <Box mb="4">
          <Text as="span" fontWeight="bold">
            Label:
          </Text>
          <Input
            value={inputData.label}
            onChange={handleInputChange}
            placeholder="Enter Label"
            name="label"
          />
        </Box>
        <Box>
          <Text as="span" fontWeight="bold">
            Data:
          </Text>
          <Input
            value={inputData.data}
            onChange={handleInputChange}
            placeholder="Enter Data"
            name="data"
          />
        </Box>
        {inputData.label && ( // Only show label name if there's a value
          <Text mt="4">
            **{inputData.label}:** {inputData.data}
          </Text>
        )}
      </CardBody>
    </Card>
  );
};

export default DynamicInputCard;
