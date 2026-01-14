import React, { useState, useEffect } from 'react'
import { attach } from "@adobe/uix-guest"
import {
  Provider,
  defaultTheme,
  View,
  ComboBox, Item
} from '@adobe/react-spectrum'

import { extensionId } from "./Constants"

export default function WpDynamicSelectField () {
  const [guestConnection, setGuestConnection] = useState()
  let [value, setValue] = useState(null);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hard-coded JSON data to avoid querying AEM while testing.
  // You can change these values freely.
  const MOCK_FOLDERS = [
    { path: "/content/dam", title: "DAM Root" },
    { path: "/content/dam/we-retail", title: "We.Retail" },
    { path: "/content/dam/we-retail/en", title: "We.Retail (EN)" },
    { path: "/content/dam/projects", title: "Projects" },
    { path: "/content/dam/projects/demo", title: "Demo" }
  ];

  // Simulate an async fetch so you can test loading + timing.
  const fetchRootFolders = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_FOLDERS;
  };

  useEffect(() => {
    (async () => {
      const connection = await attach({ id: extensionId })
      setGuestConnection(connection);

      const model = await connection.host.field.getModel();
      console.log("Dropdown model.name----------->", model.name);

      setValue(await connection.host.field.getValue() || '');

      // Use mocked data instead of querying AEM.
      const folderList = await fetchRootFolders();
      setFolders(folderList);
      setLoading(false);

      document.body.style.height = '200px';
    })()
  }, [])

  const handleSelectionChange = (newValue) => {
    setValue(newValue);
    guestConnection?.host.field.onChange(newValue);
  }

  return (
    <Provider theme={defaultTheme} colorScheme='dark' height='100vh'>
      <View padding='size-200' UNSAFE_style={{ overflow: 'hidden' }}>
        <ComboBox 
          selectedKey={value} 
          onSelectionChange={handleSelectionChange} 
          label="Select Root Folder"
          isDisabled={loading}
          width="100%"
        >
          {folders.map(folder => (
            <Item key={folder.path}>{folder.title}</Item>
          ))}
        </ComboBox>
      </View>
    </Provider>
  )
}