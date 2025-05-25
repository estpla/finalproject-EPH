const { Server } = require('socket.io');
const { createServer } = require('http');
const Client = require('socket.io-client');
const { setupSocketIO } = require('../../../src/sockets');

describe('Socket.IO Server', () => {
  let io;
  let serverSocket;
  let clientSocket;
  let httpServer;

  beforeAll((done) => {
    httpServer = createServer();
    io = setupSocketIO(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
    httpServer.close();
  });

  test('should establish connection successfully', (done) => {
    expect(clientSocket.connected).toBe(true);
    done();
  });

  test('should handle join:room event', (done) => {
    const roomId = 'test-room';
    
    // Mock socket.join method
    serverSocket.join = jest.fn();
    
    clientSocket.emit('join:room', roomId);
    
    setTimeout(() => {
      expect(serverSocket.join).toHaveBeenCalledWith(roomId);
      done();
    }, 50);
  });

  test('should handle progress:update event', (done) => {
    const progressData = { exerciseId: 1, progress: 50 };
    
    clientSocket.on('progress:updated', (data) => {
      expect(data).toEqual(progressData);
      done();
    });

    clientSocket.emit('progress:update', progressData);
  });

  test('should handle disconnect event', (done) => {
    clientSocket.on('disconnect', () => {
      expect(clientSocket.connected).toBe(false);
      done();
    });
    
    clientSocket.close();
  });

  test('should throw error when accessing uninitialized io', () => {
    // Primero resetear los módulos
    jest.resetModules();
    // Luego importar el módulo
    const sockets = require('../../../src/sockets');
    
    expect(() => {
      sockets.io;
    }).toThrow('Socket.IO no ha sido inicializado');
  });
});