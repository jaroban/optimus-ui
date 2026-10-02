# move templates from .html files to .ts files
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
    $ts =~ s/templateUrl:\s*'(.*?)'/include_template($1)/ges;
    write_text($tsFileName, $ts);
}

sub include_template {
    my $htmlFileName = shift;
    my $template = read_text($htmlFileName);
    unlink $htmlFileName;
    return "template: `\n$template    `";
}
