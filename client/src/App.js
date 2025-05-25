import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ChakraProvider,
  extendTheme,
  Box,
  Container,
  Flex,
  Heading,
  Input,
  IconButton,
  Button,
  VStack,
  HStack,
  Text,
  StackDivider,
  useColorModeValue,
  theme as baseTheme,
  chakra,
} from "@chakra-ui/react";
import {
  BsPencilSquare,
  BsTrash,
  BsPlusCircle,
  BsCheckCircle,
} from "react-icons/bs";

const customTheme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: "#E6FFFA",
      100: "#B2F5EA",
      200: "#81E6D9",
      300: "#4FD1C5",
      400: "#38B2AC",
      500: "#319795",
      600: "#2C7A7B",
      700: "#285E61",
      800: "#234E52",
      900: "#1D4044",
    },
    // Optionally, you could add a purple accent here if desired.
  },
  fonts: {
    heading: `'Segoe UI', sans-serif`,
    body: `'Segoe UI', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: "gray.900", // fallback for areas outside our main gradient
        color: "gray.100",
        lineHeight: "tall",
      },
    },
  },
});

// -------------------------------
// 2. Main App component
// -------------------------------

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function App() {
  // Existing state/hooks logic is preserved exactly.
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [editText, setEditText] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/`);
      setTodoList(res.data);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
    }
  };

  const addTodo = async () => {
    if (todo.trim().length < 3) return alert("Minimum 3 characters required");
    try {
      await axios.post(`${BACKEND_URL}/create`, { todo });
      setTodo("");
      fetchTodos();
    } catch (err) {
      console.error("Failed to add todo:", err);
    }
  };

  const updateTodo = async () => {
    if (!editId || editText.trim().length < 3) {
      alert("Minimum 3 characters required for editing");
      return;
    }
    try {
      await axios.put(`${BACKEND_URL}/update/${editId}`, { todo: editText });
      setTodoList((prevList) =>
        prevList.map((item) =>
          item.id === editId ? { ...item, todo: editText } : item
        )
      );
      setEditId(null);
      setEditText("");
    } catch (err) {
      console.error("Failed to update todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/${id}`);
      setTodoList((prevList) => prevList.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Colors that adapt to our dark theme
  const cardBg = useColorModeValue("gray.800", "gray.800");
  const inputBg = useColorModeValue("gray.700", "gray.700");
  const inputPlaceholder = useColorModeValue("gray.400", "gray.400");
  const listItemBg = useColorModeValue("gray.700", "gray.700");
  const hoverBg = useColorModeValue("gray.600", "gray.600");

  const handleSubmit = (e) => {
  e.preventDefault();
  addTodo();
};

  return (
    <ChakraProvider theme={customTheme}>
      {/* 
        - We apply a full‐screen dark gradient background using Chakra's Box with a CSS gradient.
        - All content is centered vertically and horizontally. 
      */}
      <Box
        minH="100vh"
        bgGradient="linear(to-r, gray.900, gray.800, gray.700)"
        px={{ base: 4, md: 0 }}
        py={{ base: 6, md: 12 }}
      >
        <Container maxW="lg">
          <Flex justify="center">
            {/* 
              - The “card” is a VStack with a slightly lighter charcoal background 
              - Padding, rounded corners, and a subtle box shadow are used. 
            */}
            <VStack
              w="100%"
              bg={cardBg}
              borderRadius="2xl"
              boxShadow="lg"
              spacing={6}
              p={{ base: 6, md: 10 }}
            >
              {/* Main Heading */}
              <Heading
                as="h2"
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="semibold"
                textAlign="center"
                letterSpacing="wide"
              >
                🚀 Todo App
              </Heading>

              <chakra.form w="100%" onSubmit={handleSubmit}>
                <HStack w="100%">
                  <Input
                    placeholder="What needs to be done?"
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                    bg={inputBg}
                    placeholderColor={inputPlaceholder}
                    _placeholder={{ color: inputPlaceholder }}
                    color="gray.100"
                    border="none"
                    borderRadius="md"
                    py={4}
                    px={4}
                    fontSize={{ base: "sm", md: "md" }}
                    _focus={{
                      outline: "none",
                      ring: 2,
                      ringColor: "brand.400",
                    }}
                  />
                  <IconButton
                    type="submit" // ← CHANGED: makes this a form submit
                    aria-label="Add Todo"
                    icon={<BsPlusCircle size={20} />}
                    fontSize="xl"
                    bgGradient="linear(to-r, brand.400, brand.500)"
                    color="white"
                    _hover={{
                      bgGradient: "linear(to-r, brand.500, brand.600)",
                    }}
                    _focus={{ boxShadow: "outline", ringColor: "brand.300" }}
                    isRound
                    size="lg"
                  />
                </HStack>
              </chakra.form>

              {/* Todo List Container */}
              <VStack
                w="100%"
                spacing={2}
                align="stretch"
                divider={<StackDivider borderColor="gray.600" />}
                pb={2}
              >
                {todoList.map((item) => (
                  <HStack
                    key={item.id}
                    bg={listItemBg}
                    borderRadius="md"
                    px={4}
                    py={3}
                    justify="space-between"
                    align="center"
                    _hover={{ bg: hoverBg }}
                    transition="background-color 0.2s"
                  >
                    {editId === item.id ? (
                      <HStack w="100%">
                        <Input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          bg={inputBg}
                          placeholder="Edit todo..."
                          placeholderColor={inputPlaceholder}
                          _placeholder={{ color: inputPlaceholder }}
                          color="gray.100"
                          border="none"
                          borderRadius="md"
                          py={2}
                          px={3}
                          fontSize={{ base: "sm", md: "md" }}
                          _focus={{
                            outline: "none",
                            ring: 2,
                            ringColor: "brand.400",
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") updateTodo();
                          }}
                        />
                        <IconButton
                          aria-label="Save Edit"
                          icon={<BsCheckCircle size={18} />}
                          onClick={updateTodo}
                          fontSize="lg"
                          bgGradient="linear(to-r, brand.400, brand.500)"
                          color="white"
                          _hover={{
                            bgGradient: "linear(to-r, brand.500, brand.600)",
                          }}
                          _focus={{
                            boxShadow: "outline",
                            ringColor: "brand.300",
                          }}
                          isRound
                          size="md"
                        />
                      </HStack>
                    ) : (
                      <>
                        <Text
                          flex="1"
                          fontSize={{ base: "sm", md: "md" }}
                          color="gray.100"
                          wordBreak="break-word"
                        >
                          {item.todo}
                        </Text>
                        <HStack spacing={2}>
                          <IconButton
                            aria-label="Edit Todo"
                            icon={<BsPencilSquare size={16} />}
                            onClick={() => {
                              setEditId(item.id);
                              setEditText(item.todo);
                            }}
                            fontSize="lg"
                            bgGradient="linear(to-r, brand.400, brand.500)"
                            color="white"
                            _hover={{
                              bgGradient: "linear(to-r, brand.500, brand.600)",
                            }}
                            _focus={{
                              boxShadow: "outline",
                              ringColor: "brand.300",
                            }}
                            isRound
                            size="sm"
                          />
                          <IconButton
                            aria-label="Delete Todo"
                            icon={<BsTrash size={16} />}
                            onClick={() => deleteTodo(item.id)}
                            fontSize="lg"
                            bgGradient="linear(to-r, red.400, red.500)"
                            color="white"
                            _hover={{
                              bgGradient: "linear(to-r, red.500, red.600)",
                            }}
                            _focus={{
                              boxShadow: "outline",
                              ringColor: "red.300",
                            }}
                            isRound
                            size="sm"
                          />
                        </HStack>
                      </>
                    )}
                  </HStack>
                ))}
                {/* Show a placeholder message if no todos are present */}
                {todoList.length === 0 && (
                  <Text color="gray.400" textAlign="center" py={4}>
                    No todos yet. Add one above!
                  </Text>
                )}
              </VStack>
            </VStack>
          </Flex>
        </Container>
      </Box>
    </ChakraProvider>
  );
}
