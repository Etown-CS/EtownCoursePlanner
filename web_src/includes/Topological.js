/*
This is a function currenly not implimented. It is a topologial sort of classes for preqs to feed to the AI. 
Currently thogh it only iterates through any class in the prequesits table, so any class not found in that table is not there.
The prequesists are also currently hard coded in but a simple API call can get it from the database.
*/


async function getCourses() {
    try {
        const response = await fetch('/courses');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Courses:', data);
        return data;
    } catch (error) {
        console.error('Error fetching courses:', error);
        return []; // or null, depending on how you want to handle errors
    }
}

async function  topologicalSort(prerequisites) {
    const courses = await getCourses();
    console.log("courses2:",courses);
    let graph = new Map();
    let inDegree = new Map();
    let order = [];

    // Initialize graph and inDegree map
    for (let [course, prereq] of prerequisites) {
        if (!graph.has(prereq)) graph.set(prereq, []);
        if (!graph.has(course)) graph.set(course, []);
        graph.get(prereq).push(course);
        inDegree.set(course, (inDegree.get(course) || 0) + 1);
        if (!inDegree.has(prereq)) inDegree.set(prereq, 0);
    }

    // Find all nodes with in-degree 0
    let queue = [];
    for (let [node, degree] of inDegree) {
        if (degree === 0) queue.push(node);
    }

    // Process the nodes
    while (queue.length > 0) {
        let node = queue.shift();
        order.push(node);
        for (let neighbor of graph.get(node)) {
            inDegree.set(neighbor, inDegree.get(neighbor) - 1);
            if (inDegree.get(neighbor) === 0) queue.push(neighbor);
        }
    }

    // Check for cycles
    if (order.length !== graph.size) {
        throw new Error("Cycle detected! Topological sort not possible.");
    }
    
    const courseMap = new Map();

    // Build a map for quick lookup
    for (const course of courses) {
      courseMap.set(course.id, course);
    }
  
    // Collect courses in the order of order
    const matchedCourses = order.map(id => courseMap.get(id)).filter(Boolean);
  
    console.log(matchedCourses);
    return matchedCourses;

}

// Example prerequisites list
const prerequisites = [
    [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [8, 21], 
    [8, 22], [8, 17], [9, 2], [10, 2], [11, 2], [14, 10], [15, 14], [16, 3]
];

console.log(topologicalSort(prerequisites)); 