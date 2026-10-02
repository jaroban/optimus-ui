# move templates from .ts files to .html files
use strict;
use warnings;
use File::Find;
use File::Slurper qw(read_text write_text);

find(\&visit_file, '.');

sub visit_file {
    return unless /\.ts$/;
    return if /\.test\.ts$/; # Skip test files
    my $tsFileName = $_;
    my $ts = read_text($tsFileName);
    $ts =~ s/template:\s*`(.*?)`(?=.*?\}\)\s+export\s+class\s+(\w+)\b)/extract_template($1, $2)/ges;
    write_text($tsFileName, $ts);
}

sub extract_template {
    my ($template, $className) = @_;
    my $htmlFileName = lc($className) . '.html';
    $template =~ s|<svg\s([^>]*)/>|<svg $1></svg>|gs;
    if($template !~ /[\n\r]/) {
        return "template: `$template`";
    }
    write_text($htmlFileName, $template);
    return "templateUrl: './$htmlFileName'";
}
