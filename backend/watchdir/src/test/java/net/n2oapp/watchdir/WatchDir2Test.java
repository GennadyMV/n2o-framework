package net.n2oapp.watchdir;

import org.apache.commons.io.FileUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.junit.Assert.*;
import static org.junit.Assert.assertFalse;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.verify;

/**
 * @author iryabov
 * @since 04.12.2015
 */
public class WatchDir2Test {
    private final static String TEST_DIR = getTestFolder();
    private Path path = Paths.get(TEST_DIR + "test.txt");
    private WatchDir watchDir;
    private FileChangeListener listener = mock(FileChangeListener.class);

    private static String getTestFolder()
    {
        StringBuilder customTestPath = new StringBuilder();
        customTestPath.append(System.getProperty("user.home"));
        customTestPath.append(File.separator);
        customTestPath.append(WatchDirTest.class.getSimpleName());
        customTestPath.append(File.separator);
        return customTestPath.toString();
    }

    @Before
    public void setUpClass() throws Exception
    {
        File testDir = new File(TEST_DIR);
        if (testDir.exists())
        {
            FileUtils.forceDelete(testDir);
        }
        assertTrue(testDir.mkdirs());
        reset(listener);

        watchDir = new WatchDir(Paths.get(TEST_DIR), false, listener);
    }

    @After
    public void tearDownClass() throws Exception
    {
        watchDir.stop();
        File testDir = new File(TEST_DIR);
        if (testDir.exists())
        {
            FileUtils.forceDelete(testDir);
        }
        assertFalse(testDir.exists());
    }

    /**
     * проверить, что было событие на создание и только
     */
    @Test
    @Ignore
    public void testEventOnCreate() throws Exception
    {
        watchDir.start();

        FileUtils.touch(new File(path.toString()));
        
        verify(listener, timeout(200).atLeast(1)).fileCreated(eq(path));
        verify(listener, never()).fileModified(any(Path.class));
        verify(listener, never()).fileDeleted(any(Path.class));

        watchDir.stop();
    }

    /**
     * проверить, что было событие на изменение и только
     *
     */
    @Test
    @Ignore
    public void testEventOnChange() throws Exception
    {
        FileUtils.touch(new File(path.toString()));

        watchDir.start();

        FileUtils.write(new File(path.toString()), "test");
        verify(listener, timeout(200).atLeast(1)).fileModified(eq(path));
        verify(listener, never()).fileCreated(any(Path.class));
        verify(listener, never()).fileDeleted(any(Path.class));

        watchDir.stop();
    }

    /**
     * проверить, что было событие удаления
     *
     */
    @Test
    @Ignore
    public void testEventOnDelete() throws Exception
    {
        FileUtils.touch(new File(path.toString()));
        watchDir.start();

        assertTrue(new File(path.toString()).delete());
        verify(listener, timeout(200).atLeast(1)).fileDeleted(eq(path));
        verify(listener, never()).fileCreated(any(Path.class));
        //side effect. Иногда Watcher сначала шлет modified, а потом deleted. Исключить не получилось.
//        verify(listener, timeout(200).atLeast(1)).fileModified(eq(path));

        watchDir.stop();
    }

    @Test
    @Ignore
    public void testChangeDir() throws Exception
    {
        String dir = TEST_DIR + "dir" + File.separator;

        //создание пустой папки
        reset(listener);
        watchDir.start();
        FileUtils.forceMkdir(new File(dir));
        verify(listener, timeout(200).atLeast(1)).fileCreated(eq(Paths.get(dir)));
        verify(listener, never()).fileModified(any(Path.class));
        verify(listener, never()).fileDeleted(any(Path.class));
        watchDir.stop();

        //удаление пустой папки
        reset(listener);
        watchDir.start();
        FileUtils.forceDelete(new File(dir));
        verify(listener, timeout(200).atLeast(1)).fileDeleted(eq(Paths.get(dir)));
        verify(listener, never()).fileModified(any(Path.class));
        verify(listener, never()).fileCreated(any(Path.class));
        watchDir.stop();

        //создание папки с файлом
        reset(listener);
        watchDir.start();
        FileUtils.forceMkdir(new File(dir));
        FileUtils.touch(new File(dir + "file.txt"));
        verify(listener, timeout(200).atLeast(1)).fileCreated(eq(Paths.get(dir)));
        verify(listener, never()).fileModified(any(Path.class));
        verify(listener, never()).fileDeleted(any(Path.class));
        watchDir.stop();

        //удаление папки с файлом
        reset(listener);
        watchDir.start();
        FileUtils.forceDelete(new File(dir));
        verify(listener, timeout(200).never()).fileCreated(any(Path.class));
        verify(listener, never()).fileModified(any(Path.class));
        verify(listener, timeout(200).atLeast(1)).fileDeleted(eq(Paths.get(dir)));
        watchDir.stop();
    }

    @Test
    @Ignore
    public void testCreateChangeDelete() throws Exception {
        watchDir.start();
        FileUtils.touch(new File(path.toString()));
        FileUtils.write(new File(path.toString()), "test");
        FileUtils.write(new File(path.toString()), "test2");
        FileUtils.forceDelete(new File(path.toString()));
        verify(listener, timeout(200).atLeast(1)).fileCreated(eq(path));
        verify(listener, atLeast(1)).fileDeleted(eq(path));
        verify(listener, never()).fileModified(any(Path.class));

        watchDir.stop();
    }

}
