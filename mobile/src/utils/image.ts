import * as ImageManipulator from 'expo-image-manipulator';

export const processImage = async (uri: string): Promise<string> => {
    const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1200 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
};
