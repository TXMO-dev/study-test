import {
  Box,
  Button,
  Center,
  Flex,
  FormErrorMessage,
  FormLabel,
  Container,
  Image,
  Input,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { ErrorMessage } from 'formik';
import { useRef, useState } from 'react';

type ImageUploadProps = {
  label?: string;
  name: string;
  initialValue: string;
  setFieldValue: (field: string, value: string) => void;
  uploadPreset: string;
  placeholder: string;
  error?: string;
};

const FormikImageUpload = (props: ImageUploadProps) => {
  const {
    label,
    name,
    initialValue,
    setFieldValue,
    uploadPreset,
    placeholder,
    error,
  } = props;
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const uploadImage = async (e: { target: { files: any } }) => {
    const files = e.target.files;
    let filename = files[0]?.name;
    filename = filename.replace(/\s/g, '-');
    filename = filename.replace(/~/g, '-');
    filename = filename.replace(/[^a-zA-Z0-9-_]/g, '');
    
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', uploadPreset || '');
    data.append('public_id', filename);
    setLoading(true);

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/fl-meeting-assist/image/upload',
      {
        method: 'POST',
        body: data,
      },
    );
    const file = await res.json();

    setImage(file.secure_url);

    setFieldValue(`${name}`, file.secure_url);
    setLoading(false);
  };

  return (
    <>
      {label ? (
        <FormLabel className="label" htmlFor={name}>
          {label}
        </FormLabel>
      ) : null}

      <Flex flexDir={'column'}>
        {loading ? (
          <Center>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
              label="Uploading Image"
            />
          </Center>
        ) : (
          (image || initialValue) && (
            <Container>
              <Image
                src={image || initialValue}
                  alt=""
                  maxH={'300px'}
                padding="15px"
                borderRadius="20px"
                marginBottom="10px"
              />
            </Container>
          )
        )}
        <Text as="label" width="100%">
          <Input
            id={name}
            name={name}
            style={{ display: 'none' }}
            type="file"
            accept="image/jpg, image/jpeg, image/png, image/webp"
            onChange={uploadImage}
            ref={fileInputRef}
          />

          <Button
            bgColor="#202A3B"
            color={'#fff'}
            width={'300px'}
            isLoading={loading}
            onClick={handleButtonClick}
          >
            {placeholder}
          </Button>
        </Text>
      </Flex>
      {error && (
        <Center>
          <FormErrorMessage>{props.error}</FormErrorMessage>
        </Center>
      )}
      {!error ?? <ErrorMessage name={name} />}
    </>
  );
};

export default FormikImageUpload;