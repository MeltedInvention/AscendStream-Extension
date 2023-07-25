// contentScript.js

// Regular expression patterns to match email addresses and IP addresses
const emailRegex = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;

// Function to hide email addresses and IP addresses in a node
function hideEmailsAndIPs(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const originalText = node.textContent;
    let modifiedText = originalText;

    modifiedText = modifiedText.replace(emailRegex, '*******');
    modifiedText = modifiedText.replace(ipRegex, '*******');

    if (originalText !== modifiedText) {
      const newNode = document.createTextNode(modifiedText);
      node.parentNode.replaceChild(newNode, node);
    }
  }
}

// Function to traverse the DOM and hide email addresses and IP addresses
function traverseAndHide(node) {
  if (node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA') {
    return; // Skip input and textarea elements
  }

  hideEmailsAndIPs(node);

  for (const childNode of node.childNodes) {
    traverseAndHide(childNode);
  }
}

// Mutation observer callback
function handleMutations(mutationsList) {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      for (const addedNode of mutation.addedNodes) {
        traverseAndHide(addedNode);
      }
    }
  }
}

// Hide email addresses and IP addresses on page load
traverseAndHide(document.body);

// Mutation observer to handle dynamic content changes
const observer = new MutationObserver(handleMutations);
observer.observe(document.body, {
  childList: true,
  subtree: true
});
