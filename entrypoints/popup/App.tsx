import { useState } from 'react';
import { Button, Group, ScrollArea, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import './App.css';

function App() {
  const [blockedUrl, setBlockedUrl] = useState<string[]>([]);

  const form = useForm({
    mode: 'controlled',
    initialValues: { url: '' }
  })

  const submit = (values: ({ url: string })) => {
    setBlockedUrl([...blockedUrl, values.url]);
  }

  return <div>
    <form onSubmit={form.onSubmit(submit)}>
      <Group align="flex-end" wrap="nowrap">
        <TextInput
          withAsterisk
          label="URL"
          placeholder="example.com"
          style={{ flex: 1 }}
          key={form.key('url')}
          {...form.getInputProps('url')}
        />
        <Button type="submit">Block</Button>
      </Group>
    </form>
    {blockedUrl.length > 0 ? <Stack gap={0}>
      <p>Block urls:</p>
      <ScrollArea.Autosize mah={250}>
        {blockedUrl.map(url => <p>{url}</p>)}
      </ScrollArea.Autosize>
    </Stack> : <p>No any blocked url</p>}
  </div>
}

export default App;